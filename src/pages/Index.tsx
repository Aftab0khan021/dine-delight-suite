import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dine Delight SaaS</h1>
        <p className="text-muted-foreground">Manage your restaurant with ease.</p>
      </div>
      
      <div className="flex gap-4">
        {/* Link to the Login Page */}
        <Button asChild size="lg">
          <Link to="/auth">Login to Dashboard</Link>
        </Button>

        {/* Optional: Link to a demo tenant for testing */}
        <Button variant="outline" size="lg" asChild>
          <a href="http://demo-burger.localhost:3000">Visit Demo Store</a>
        </Button>
      </div>
    </div>
  );
};

export default Index;