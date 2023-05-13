import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";
import styled from "styled-components";
import { CMap, cmaps, supplements } from "@/cmap";
import { Glyph } from "@/components/Glyph";

const Page = styled.div`
  color: #333;
  margin: 32px 40px;
  display: flex;
`;

const Navigation = styled.nav`
  padding-left: 40px;
  position: fixed;
  left: 0;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const H1 = styled.h1`
  line-height: 1;
  font-size: 20px;
  margin: 0 0 16px 0;
`;

const H2 = styled.h2`
  margin: 0;
`;

const CmapList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Main = styled.div`
  margin-left: 220px;
`;

const Glyphs = styled.div<{ bgColor: string }>`
  width: ${60 * 10 + 8 * 9}px;
  margin: 0 -16px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  background: ${({ bgColor }) => bgColor};
`;

interface IndexProps {
  name: string;
  cmap: CMap;
}

const Index: NextPage<IndexProps> = ({ name, cmap }: IndexProps) => {
  const sortedUniToCid = cmap.uniToCid.sort((a, b) => a.cid - b.cid);
  const isVertical = cmaps.find((cmap) => cmap.name === name)!.vertical;
  const glyphs = supplements.map(({ cidTo }, index, array) =>
    sortedUniToCid.filter(
      ({ cid }) =>
        (array[index - 1]?.cidTo ?? -1) < cid && cid <= (cidTo ?? 65535)
    )
  );

  return (
    <>
      <Head>
        <title>{name} - cmap-display</title>
        <meta name="description" content="CMap を表示します" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page>
        <Navigation>
          <H1>{name}</H1>
          <h3>Adobe-Japan 1-7</h3>
          <CmapList>
            {cmaps.map(({ name }) => (
              <li key={name}>
                <Link href={`/cmap/${name}`}>{name}</Link>
              </li>
            ))}
          </CmapList>
          <h3>文字セット</h3>
          <ul>
            <li>
              <a href="#std">Std</a>
            </li>
            <li>
              <a href="#pro">Pro</a>
            </li>
            <li>
              <a href="#pr5">Pr5</a>
            </li>
            <li>
              <a href="#pr6">Pr6</a>
            </li>
          </ul>
        </Navigation>
        <Main>
          <Header>
            <H2>{name}</H2>
            <Link href={`/${name}`}>CMap をダウンロード</Link>
            <Link href={`/${name}.json`}>JSON 形式でダウンロード</Link>
          </Header>
          {supplements.map(({ type, supplement, color }, index) => (
            <section id={type} key={type}>
              <h3>Std（Adobe-Japan 1-{supplement}）</h3>
              <Glyphs bgColor={color}>
                {glyphs[index].map((pair, index) => (
                  <Glyph
                    unicode={pair.unicode}
                    cid={pair.cid}
                    key={index}
                    vertical={isVertical}
                  />
                ))}
              </Glyphs>
            </section>
          ))}
        </Main>
      </Page>
    </>
  );
};

export default Index;

export const getStaticProps: GetStaticProps<IndexProps> = async (
  context: GetStaticPropsContext
) => {
  const cmapName = context.params!.name as string;
  const jsonPath = path.join(process.cwd(), `/public/${cmapName}.json`);
  const cmap: CMap = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  return {
    props: {
      name: cmapName,
      cmap: cmap,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = cmaps.map((cmap) => ({
    params: { name: cmap.name },
  }));
  return {
    paths,
    fallback: false,
  };
};
