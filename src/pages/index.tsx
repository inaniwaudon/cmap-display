import { GetStaticProps } from "next";

const Index = () => <></>;

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: "/cmap/UniJIS-UTF16-H",
    },
  };
};
