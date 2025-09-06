interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <button
      className="w-fit mx-auto border border-primary text-primary
             bg-transparent hover:bg-primary hover:text-white
             transition duration-200 ease-in-out cursor-pointer
             font-medium py-2 px-4 rounded"
      {...rest}
    >
      {children}
    </button>
  );
};
