// src/components/common/DashboardCard.tsx
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/ui/card";

export interface DashboardCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  footer,
  children,
  className,
  ...rest
}) => {
  return (
    <Card className={className} {...rest}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
