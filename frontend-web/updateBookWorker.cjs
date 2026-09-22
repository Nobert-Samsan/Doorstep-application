const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/customer/BookWorker.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add Shield to imports
if (!content.includes('Shield, ')) {
  content = content.replace(/import { CheckCircle, Clock, Calendar, ChevronLeft, ShieldCheck } from 'lucide-react';/, "import { CheckCircle, Clock, Calendar, ChevronLeft, ShieldCheck, Shield } from 'lucide-react';");
}

// 2. Add urgency state
if (!content.includes('const [urgency, setUrgency] = useState(')) {
  content = content.replace(
    /const \[isBookingSuccess, setIsBookingSuccess\] = useState\(false\);/,
    `const [isBookingSuccess, setIsBookingSuccess] = useState(false);\n  const [urgency, setUrgency] = useState('emergency');`
  );
}

// 3. Update submitDirectBooking logic
const oldSubmit = `if (!bookingData.date || !bookingData.time || !bookingData.streetAddress || !bookingData.city) {
          return toast.error("Please select a date, time, and provide address details");
      }`;
      
const newSubmit = `if (urgency === 'specific' && (!bookingData.date || !bookingData.time)) {
          return toast.error("Please select a preferred date and time.");
      }
      if (!bookingData.streetAddress || !bookingData.city) {
          return toast.error("Please provide your service address details.");
      }

      let finalDate = bookingData.date || new Date().toISOString().split('T')[0];
      let finalTime = bookingData.time;

      if (urgency === 'emergency') {
        finalTime = 'ASAP (Emergency)';
      } else if (urgency === 'flexible') {
        finalTime = 'Flexible timeframe';
      }`;

content = content.replace(oldSubmit, newSubmit);

// 4. Update the api.post call payload
content = content.replace(
  /scheduledDate: bookingData.date,\s*scheduledTimeSlot: bookingData.time,/,
  `scheduledDate: finalDate,
              scheduledTimeSlot: finalTime,`
);

// 5. Replace Date/Time UI
const oldUIStart = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Date</label>`;
                    
const oldUIEnd = `required 
                      />
                    </div>
                  </div>
                </div>`;
                
const newUI = `<div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">When do you need this done?</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <label className="cursor-pointer">
                      <input type="radio" name="urgency" value="emergency" checked={urgency === 'emergency'} onChange={(e) => setUrgency(e.target.value)} className="peer hidden" />
                      <div className="border-2 border-gray-100 rounded-2xl p-4 hover:bg-gray-50 peer-checked:border-red-500 peer-checked:bg-red-50 transition-colors h-full">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-2">
                          <Shield size={20} />
                        </div>
                        <div className="font-bold text-gray-900 mb-1 text-sm">Emergency</div>
                        <div className="text-xs text-gray-500 font-medium">As soon as possible!</div>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input type="radio" name="urgency" value="flexible" checked={urgency === 'flexible'} onChange={(e) => setUrgency(e.target.value)} className="peer hidden" />
                      <div className="border-2 border-gray-100 rounded-2xl p-4 hover:bg-gray-50 peer-checked:border-amber-500 peer-checked:bg-amber-50 transition-colors h-full">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-2">
                          <Clock size={20} />
                        </div>
                        <div className="font-bold text-gray-900 mb-1 text-sm">Flexible</div>
                        <div className="text-xs text-gray-500 font-medium">Within a few days.</div>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input type="radio" name="urgency" value="specific" checked={urgency === 'specific'} onChange={(e) => setUrgency(e.target.value)} className="peer hidden" />
                      <div className="border-2 border-gray-100 rounded-2xl p-4 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors h-full">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                          <Calendar size={20} />
                        </div>
                        <div className="font-bold text-gray-900 mb-1 text-sm">Specific Date</div>
                        <div className="text-xs text-gray-500 font-medium">Choose a preferred date.</div>
                      </div>
                    </label>

                  </div>
                </div>

                {urgency === 'specific' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Date</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          name="date"
                          value={bookingData.date}
                          onChange={handleBookingChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 font-medium" 
                          required={urgency === 'specific'} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Time</label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="time" 
                          name="time"
                          value={bookingData.time}
                          onChange={handleBookingChange}
                          className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 font-medium" 
                          required={urgency === 'specific'} 
                        />
                      </div>
                    </div>
                  </div>
                )}`;

const regex = /<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">\s*<div>\s*<label className="block text-sm font-bold text-gray-900 mb-2">Date<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

content = content.replace(regex, newUI);

fs.writeFileSync(filePath, content);
console.log('BookWorker.jsx updated with segmented control!');
