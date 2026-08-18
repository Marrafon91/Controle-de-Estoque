import { Link, type LinkProps } from "react-router-dom";
import type { ReactNode } from "react";

type ButtonType = {
  children: ReactNode;
  variant?: "entrada" | "registro";
} & LinkProps;

const Button = ({
  children,
  variant = "entrada",
  ...props
}: ButtonType) => {
  const variants = {
    entrada:
      "bg-success-500 flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 text-white",
    registro:
      "bg-info-600 flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 text-white",
  };

  return (
    <Link {...props} className={variants[variant]}>
      {children}
    </Link>
  );
};

export default Button;
