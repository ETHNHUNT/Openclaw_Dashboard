import { Rocket, Target, Zap, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickStartGuideProps {
  onCreateTask: () => void;
}

export default function QuickStartGuide({ onCreateTask }: QuickStartGuideProps) {
  const steps = [
    {
      icon: <Target className="text-eth-accent" size={24} />,
      title: 'Create Your First Mission',
      description: 'Click "NEW TASK" to define your objectives and set priorities.',
    },
    {
      icon: <Zap className="text-amber-400" size={24} />,
      title: 'Track Progress',
      description: 'Move tasks through Planning → In Progress → Done as you work.',
    },
    {
      icon: <CheckCircle2 className="text-emerald-400" size={24} />,
      title: 'Collaborate',
      description: 'Add comments, assign agents, and monitor real-time updates.',
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-[500px] p-8">
      <Card className="max-w-3xl w-full bg-eth-900 border-eth-700">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-6 bg-eth-accent/10 rounded-full">
              <Rocket className="text-eth-accent" size={48} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Welcome to Mission Control
          </CardTitle>
          <p className="text-eth-500 text-sm">
            Get started by creating your first mission. Here's how it works:
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 bg-eth-800/40 rounded-lg border border-eth-700/50 hover:border-eth-accent/30 transition-all"
              >
                <div className="p-3 bg-eth-900/50 rounded-lg w-fit mb-4">
                  {step.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-eth-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={onCreateTask}
              className="bg-eth-accent text-eth-950 font-bold hover:bg-eth-accent/90 text-lg px-8 py-6"
            >
              <Target size={20} className="mr-2" />
              Create Your First Mission
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
