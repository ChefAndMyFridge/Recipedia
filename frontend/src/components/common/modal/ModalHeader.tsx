interface ModalHeaderProps {
  title: string;
}

const ModalHeader = ({ title }: ModalHeaderProps) => {
  return (
    <header className="flex items-center justify-start p-4 border-b">
      <h2 className="font-preRegular text-lg font-semibold">{title}</h2>
    </header>
  );
};

export default ModalHeader;
