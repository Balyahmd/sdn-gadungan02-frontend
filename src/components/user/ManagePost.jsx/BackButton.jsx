export default function BackButton() {
  return (
    <Link to="/postingan">
      <Button variant="text" className="flex items-center gap-2 mb-6 px-0">
        <ArrowLeftIcon className="h-5 w-5" />
        Kembali ke Beranda
      </Button>
    </Link>
  );
}
