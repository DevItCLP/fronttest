interface headerMain {
  id: string;
  header: string;
  module: string;
  href: string;
}

interface subTitles {
  id: string;
  header: string;
  code: number;
  open?: boolean;
}

interface itemsTitles {
  id: string;
  title: string;
  icon: any;
  idSubTitles: number;
  href: string;
}
