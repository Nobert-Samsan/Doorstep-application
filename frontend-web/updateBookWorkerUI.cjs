const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/customer/BookWorker.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add new imports
if (!content.includes('import { DISTRICTS }')) {
  content = content.replace(
    /import api from '\.\.\/\.\.\/services\/api';/,
    `import api from '../../services/api';
import { DISTRICTS } from '../../constants/districts';
import MapLocationPicker from '../../components/MapLocationPicker';
import { Briefcase, MapPin, UploadCloud, Info } from 'lucide-react';`
  );
}

// 2. Add state variables for map and photos
if (!content.includes('const [showMap, setShowMap] = useState(false);')) {
  content = content.replace(
    /const \[urgency, setUrgency\] = useState\('emergency'\);/,
    `const [urgency, setUrgency] = useState('emergency');
  const [showMap, setShowMap] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);`
  );
}

// 3. Update the Banner subtitle (from "Verified Professional" to profession, district, city, street)
content = content.replace(
  /<ShieldCheck size=\{16\} className="text-primary" \/> Verified Professional/,
  `<Briefcase size={16} className="text-primary" /> {worker.services?.[0]?.serviceTitle || 'Professional'} • {worker.userId?.district || ''} • {worker.userId?.city || ''} • {worker.userId?.streetAddress || ''}`
);

// 4. Update bookingData payload to include district and coordinates
content = content.replace(
  /district: bookingData\.city,/,
  `district: bookingData.district || bookingData.city,
              coordinates: mapCoordinates ? { lat: mapCoordinates.lat, lng: mapCoordinates.lng } : null,`
);

// 5. Update Address & Location UI & Upload Photos
const oldAddressUIStart = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Service Address</label>`;

const newAddressUI = `<div className="space-y-6 pt-2 border-t border-gray-100 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Location Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">District</label>
                      <select name="district" value={bookingData.district || ''} onChange={handleBookingChange} className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium bg-white" required>
                        <option value="">Select District</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">City / Town</label>
                      <input type="text" name="city" value={bookingData.city} onChange={handleBookingChange} placeholder="e.g. Nugegoda" className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Street Address</label>
                    <input type="text" name="streetAddress" value={bookingData.streetAddress} onChange={handleBookingChange} placeholder="e.g. 123 Main Street" className="w-full border-2 border-gray-100 rounded-xl py-3.5 px-4 focus:border-primary focus:ring-0 outline-none text-gray-900 font-medium mb-6" required />
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">Exact Location (Optional)</label>
                      
                      <div className="space-y-3">
                        {/* Option 1: Current Location */}
                        <button 
                          type="button"
                          onClick={() => {
                            if (!navigator.geolocation) {
                              toast.error("Geolocation is not supported by your browser");
                              return;
                            }
                            
                            const toastId = toast.loading("Finding your location...");
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                toast.dismiss(toastId);
                                setMapCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                                toast.success("Location found!");
                                setShowMap(true);
                              },
                              (error) => {
                                toast.dismiss(toastId);
                                toast.error("Could not get your location. Please check permissions or use the map.");
                              },
                              { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
                            );
                          }}
                          className="w-full flex items-center p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-amber-50 transition-colors group text-left"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Use Current Location</div>
                            <div className="text-xs text-gray-500 mt-0.5">Automatically find where you are right now</div>
                          </div>
                        </button>

                        {/* Option 2: Set on Map */}
                        <button 
                          type="button"
                          onClick={() => {
                            if (!showMap) {
                              setShowMap(true);
                              // Optionally try to center map on their location if we don't have one yet
                              if (!mapCoordinates && navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                  (position) => {
                                    setMapCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                                  },
                                  () => {}, // Ignore errors
                                  { enableHighAccuracy: false, timeout: 5000 }
                                );
                              }
                            } else {
                              setShowMap(false);
                            }
                          }}
                          className="w-full flex items-center p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-amber-50 transition-colors group text-left"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-primary transition-colors text-gray-500">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Set on Map</div>
                            <div className="text-xs text-gray-500 mt-0.5">Drop a pin exactly where you need the service</div>
                          </div>
                        </button>
                      </div>

                      {showMap && (
                        <div className="mt-4 animate-fadeIn border-2 border-gray-100 rounded-2xl overflow-hidden">
                          <MapLocationPicker 
                            mapCoordinates={mapCoordinates} 
                            setMapCoordinates={setMapCoordinates} 
                          />
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2 bg-blue-50 text-blue-700 p-3 rounded-xl mt-4 border border-blue-100">
                        <Info size={16} className="mt-0.5 shrink-0" />
                        <p className="text-xs font-medium">For your privacy, your exact street address and coordinates are hidden. They are only revealed to the specific worker you choose to hire.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-2 border-t border-gray-100 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Job Details & Photos</h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Additional Notes (Optional)</label>
                    <textarea 
                      name="notes"
                      rows="3"
                      value={bookingData.notes}
                      onChange={handleBookingChange}
                      placeholder="Describe what needs fixing in detail..."
                      className="w-full border-2 border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 font-medium resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-900 mb-1">Upload Photos of the Issue (Highly Recommended)</label>
                    <p className="text-xs text-gray-500 mb-3">Workers provide much more accurate quotes when they can see exactly what needs to be fixed or worked on.</p>
                    
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative overflow-hidden">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/png, image/jpeg" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            setUploadedPhotos((prev) => [...prev, ...Array.from(e.target.files)]);
                          }
                        }}
                      />
                      <div className="flex flex-col items-center pointer-events-none">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud size={24} className="text-primary" />
                        </div>
                        <p className="font-bold text-gray-900 mb-1">Click to upload photos</p>
                        <p className="text-xs text-gray-500 font-medium">PNG, JPG up to 5MB (Max 3)</p>
                      </div>
                    </div>
                    
                    {/* Photo Previews */}
                    {uploadedPhotos.length > 0 && (
                      <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                        {uploadedPhotos.map((photo, idx) => (
                          <div key={idx} className="relative shrink-0">
                            <img 
                              src={URL.createObjectURL(photo)} 
                              alt="Preview" 
                              className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                            />
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>`;

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">\s*<div className="md:col-span-2">\s*<label className="block text-sm font-bold text-gray-900 mb-2">Service Address<\/label>[\s\S]*?<\/textarea>\s*<\/div>\s*<\/div>/;

if (regex.test(content)) {
  content = content.replace(regex, newAddressUI);
  fs.writeFileSync(filePath, content);
  console.log('BookWorker.jsx updated successfully!');
} else {
  console.error('Could not find target section in BookWorker.jsx');
}
