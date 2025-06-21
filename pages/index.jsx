import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const roles = [
  'Dr. Schaefer',
  'Karina (Ops Lead)',
  'Front Desk Staff',
  'Medical Assistant',
  'Admin/HR'
];

const questionsByRole = {
  'Dr. Schaefer': [
    'From your leadership perspective, what are your top concerns related to data security?',
    'Are you confident the current staff understands HIPAA implications in daily workflows?',
    'What would a low-disruption, high-impact cybersecurity improvement look like to you?'
  ],
  'Karina (Ops Lead)': [
    'Do you provide cybersecurity or HIPAA-related onboarding for new staff?',
    'How do you track or verify staff understanding of access control procedures?',
    'Are IT issues like software updates or staff access changes documented?' 
  ],
  'Front Desk Staff': [
    'What do you use most often to log into EPIC?',
    'Do you ever use Gmail or personal email to communicate with patients?',
    'Have you ever received any HIPAA or security training in this role?'
  ],
  'Medical Assistant': [
    'Do you know how to dispose of printed patient info securely?',
    'What tools or apps do you use to help manage patients or communication?',
    'Have you been trained on HIPAA best practices in this job?'
  ],
  'Admin/HR': [
    'Is there a centralized record of completed HIPAA or IT training for staff?',
    'How is account access handled when someone leaves or changes jobs?',
    'Are you aware of any policies regarding device usage or patient data sharing?'
  ]
};

export default function SurveyPortal() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [responses, setResponses] = useState({});

  const handleInput = (index, value) => {
    setResponses(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    console.log('Responses for', selectedRole, responses);
    alert('Thank you for your input! Your responses have been saved.');
    setResponses({});
    setSelectedRole(null);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">QuadVision Cybersecurity Capstone Survey</h1>

      {!selectedRole && (
        <>
          <p className="text-lg font-medium">Please select your role to begin:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map(role => (
              <Button key={role} onClick={() => setSelectedRole(role)}>{role}</Button>
            ))}
          </div>
        </>
      )}

      {selectedRole && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">{selectedRole} — Survey Questions</h2>
          {questionsByRole[selectedRole].map((q, idx) => (
            <Card key={idx} className="p-4">
              <CardContent>
                <p className="font-medium mb-2">{q}</p>
                <Textarea
                  placeholder="Type your answer here..."
                  value={responses[idx] || ''}
                  onChange={(e) => handleInput(idx, e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
          <Button className="mt-4" onClick={handleSubmit}>Submit My Responses</Button>
        </div>
      )}
    </div>
  );
}
