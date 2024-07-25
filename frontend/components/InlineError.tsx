import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';

const InlineError = ({
    title,
    description
}: {
    title: string,
    description: string
}) => {
    return (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>
                <h3 className='text-2xl font-semibold leading-none tracking-tight text-red-700'>
                    {title}
                </h3>
            </AlertTitle>
            <AlertDescription>
                <p className="text-lg text-red-700 text-muted-foreground">
                    {description}
                </p>

            </AlertDescription>
        </Alert>
    );
};

export default InlineError;