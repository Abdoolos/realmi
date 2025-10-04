import React from 'react';
import AIAssistant from '@/components/ai/AIAssistant';
import ProtectedRoute from '@/components/ProtectedRoute';

function AIAssistantPage() {
  return (
    <div>
      <AIAssistant />
    </div>
  );
}

export default () => (
  <ProtectedRoute>
    <AIAssistantPage />
  </ProtectedRoute>
);