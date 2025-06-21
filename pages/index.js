import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

/**
 * QuadVision Capstone Survey Portal (v3)
 * --------------------------------------
 *
 * 🎯 **Next Steps: Step-by-Step Guide**
 *
 * 1. **Initialize a Next.js Project**
 *    - Open VS Code.
 *    - From the Terminal (Ctrl+`), run:
 *        npx create-next-app@latest capstone-survey-portal
 *    - Choose defaults and wait until setup completes.
 *
 * 2. **Install Dependencies**
 *    - Change directory:
 *        cd capstone-survey-portal
 *    - Install existing UI components (if using ShadCN):
 *        npm install @components/ui react-select
 *    - Ensure you have the following in your package.json:
 *        "dependencies": {
 *          "react": "^18.x",
 *          "next": "^13.x",
 *          "@components/ui": "^1.0.0"
 *        }
 *
 * 3. **Add the Survey Page**
 *    - Replace the contents of `pages/index.jsx` with the code below (all in one file).
 *    - Ensure file path and import aliases match (`@/components/ui/...`).
 *
 * 4. **Run Locally & Preview**
 *    - Start the dev server:
 *        npm run dev
 *    - Open http://localhost:3000 in your browser.
 *    - You should see the stakeholder selection and survey interface.
 *
 * 5. **Deploy & Share**
 *    - Push your folder to GitHub.
 *    - On Vercel (or Netlify), import the repo.
 *    - Set environment variable `NEXT_PUBLIC_SHEET_API_URL` to your analytics endpoint.
 *    - Deploy and share the live link.
 *
 * **Note:** All clinic stakeholders (no student roles) and their assigned questions
 * are defined inline in this file. You can further extend the `questions` array
 * to cover any additional control areas or stakeholders as needed.
 */

// ---- CLINIC STAKEHOLDERS ----
const users = [
  { id: 1, name: 'Dr. Cynthia Schaefer', role: 'Executive Sponsor (Lead Physician)' },
  { id: 2, name: 'Yesenia Aguila', role: 'Nurse Practitioner' },
  { id: 3, name: 'Karina Espinoza', role: 'Operations Lead / HR' },
  { id: 4, name: 'Mignon Willis', role: 'Billing Manager' },
  { id: 5, name: 'Zaman Benyameen', role: 'Office Manager' },
  { id: 6, name: 'Elvie Bayani', role: 'Pathology Head' }
];

// ---- COMPLETE SURVEY QUESTIONS ----
const questions = [
  { id: 1, assignedTo: [1,4,5,6], topic: 'GRC', area: 'Policy Management', text: 'Do you have documented cybersecurity policies, including incident response & access control?' },
  { id: 2, assignedTo: [1,4,5,6], topic: 'GRC', area: 'Risk Management', text: 'Has a formal cybersecurity risk assessment process been performed and documented?' },
  { id: 3, assignedTo: [1,4,5,6], topic: 'GRC', area: 'Incident Response', text: 'Is there a tested incident response plan for IT/security incidents?' },
  { id: 4, assignedTo: [1,4,5,6], topic: 'GRC', area: 'Vendor Management', text: 'Are third-party vendors assessed and required to meet security/HIPAA standards?' },
  { id: 5, assignedTo: [1,2,3,4,5,6], topic: 'HIPAA', area: 'Training', text: 'How often do you present or receive HIPAA training for privacy/security?' },
  { id: 6, assignedTo: [1,2,3,4,5,6], topic: 'HIPAA', area: 'Privacy Rule Compliance', text: 'How do you ensure patient privacy in public and shared spaces?' },
  { id: 7, assignedTo: [1,4,5,6], topic: 'HIPAA', area: 'Security Rule Compliance', text: 'What technical safeguards are in place for electronic health records?' },
  { id: 8, assignedTo: [1], topic: 'HIPAA', area: 'Governance', text: 'How often are HIPAA policies and risk analyses updated?' },
  { id: 9, assignedTo: [2,3], topic: 'EPIC', area: 'Incident Response', text: 'If Epic/EHR fails, what is the contingency plan to maintain operations?' },
  { id: 10, assignedTo: [3], topic: 'General', area: 'Awareness', text: 'Do you conduct phishing simulations and staff awareness exercises?' },
  { id: 11, assignedTo: [3,5], topic: 'General', area: 'Change Management', text: 'Is there a formal patch and update approval process in place?' }
];

export default function CapstoneSurveyPortal() {
  const [activeUser, setActiveUser] = useState(null);
  const [responses, setResponses] = useState({});
  const [maturity, setMaturity] = useState({});
  const [notes, setNotes] = useState({});

  const assignedQuestions = activeUser
    ? questions.filter(q => q.assignedTo.includes(activeUser))
    : [];

  const handleField = (qid, field, value) => {
    const setters = { response: setResponses, maturity: setMaturity, notes: setNotes };
    setters[field](prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_SHEET_API_URL;
      if (!url) throw new Error('NEXT_PUBLIC_SHEET_API_URL not set');
      const payload = assignedQuestions.map(q => ({
        stakeholderId: activeUser,
        stakeholderName: users.find(u => u.id === activeUser).name,
        questionId: q.id,
        topic: q.topic,
        area: q.area,
        questionText: q.text,
        response: responses[q.id] || '',
        maturity: maturity[q.id] || '',
        notes: notes[q.id] || '',
        timestamp: new Date().toISOString()
      }));
      const res = await fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(res.statusText);
      alert('Submitted successfully!');
      setActiveUser(null); setResponses({}); setMaturity({}); setNotes({});
    } catch (err) {
      console.error(err);
      alert(`Submission error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">QuadVision Capstone Survey Portal</h1>

      {!activeUser ? (
        <>
          <p>Select your name to begin:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {users.map(u => (
              <Button key={u.id} onClick={() => setActiveUser(u.id)}>
                {u.name} — {u.role}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={() => setActiveUser(null)}>← Change user</Button>
          <h2 className="text-2xl font-semibold mt-4 mb-4">
            Survey for {users.find(u => u.id === activeUser).name}
          </h2>

          {assignedQuestions.length === 0 ? (
            <p className="text-red-600">No questions assigned. Contact Capstone lead.</p>
          ) : (
            <div className="space-y-8">
              {assignedQuestions.map(q => (
                <Card key={q.id} className="p-4">
                  <CardContent>
                    <p className="font-semibold mb-1">[{q.topic} / {q.area}]</p>
                    <p className="italic mb-3">{q.text}</p>

                    <label className="block mb-1 font-medium">Response:</label>
                    <Textarea
                      value={responses[q.id] || ''}
                      onChange={e => handleField(q.id, 'response', e.target.value)}
                      className="w-full mb-3"
                    />

                    <label className="block mb-1 font-medium">Maturity:</label>
                    <Select onValueChange={v => handleField(q.id, 'maturity', v)}>
                      <SelectTrigger className="w-full mb-3">{maturity[q.id] || 'Select level'}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 — Not Implemented</SelectItem>
                        <SelectItem value="2">2 — Partial</SelectItem>
                        <SelectItem value="3">3 — Full</SelectItem>
                      </SelectContent>
                    </Select>

                    <label className="block mb-1 font-medium">Notes:</label>
                    <Textarea
                      value={notes[q.id] || ''}
                      onChange={e => handleField(q.id, 'notes', e.target.value)}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              ))}
              <Button onClick={handleSubmit} className="mt-4">Submit Answers</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
