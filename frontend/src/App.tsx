import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center gap-4">
      <Button variant="default">Download Video</Button>
      <Button variant="outline">View History</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}

export default App;
