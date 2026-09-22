const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/customer/PostJob.jsx', 'utf8');

code = code.replace('const [step, setStep] = useState(1);', `const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ category: '', jobDescription: '', district: '', city: '', streetAddress: '', urgency: 'normal' });
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});`);

code = code.replace(/const handleSubmit = \(e\) => \{[\s\S]*?setStep\(3\);\s*\};/, `const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      photos.forEach(p => data.append('photos', p));
      
      await api.post('/customer/broadcast-job', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Job broadcasted successfully!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };`);

code = code.replace('<textarea rows="4"', '<textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} rows="4"');
code = code.replace(/<input type="radio" name="category" value=\{c\.id\} className="peer hidden" required \/>/g, '<input type="radio" name="category" value={c.id} checked={formData.category === c.id} onChange={handleInputChange} className="peer hidden" required />');
code = code.replace(/<select className="w-full/g, '<select name="district" value={formData.district} onChange={handleInputChange} className="w-full');
code = code.replace(/<input type="text" placeholder="e\.g\. Nugegoda" className="w-full/g, '<input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Nugegoda" className="w-full');
code = code.replace(/<input type="text" placeholder="e\.g\. 123 Main Street" className="w-full/g, '<input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} placeholder="e.g. 123 Main Street" className="w-full');
code = code.replace(/<input type="radio" name="urgency" value="/g, '<input type="radio" name="urgency" onChange={handleInputChange} checked={formData.urgency === "');

// Fix the checked attribute closing quote hack I just made
code = code.replace(/checked=\{formData\.urgency === "normal"/g, 'checked={formData.urgency === "normal"} value="normal"');
code = code.replace(/checked=\{formData\.urgency === "soon"/g, 'checked={formData.urgency === "soon"} value="soon"');
code = code.replace(/checked=\{formData\.urgency === "urgent"/g, 'checked={formData.urgency === "urgent"} value="urgent"');

code = code.replace(/import \{ Link \} from 'react-router-dom';/, "import { Link } from 'react-router-dom';\nimport api from '../../services/api';");

fs.writeFileSync('frontend-web/src/pages/customer/PostJob.jsx', code);
console.log('Done!');
