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
import Navigation from "@/components/Navigation";
import { Anchor } from "@/components/Parts";

const Page = styled.div`
  color: #333;
  margin: 32px 40px;
  display: flex;
`;

const H2 = styled.h2`
  margin: 0;
`;

const Main = styled.div`
  margin-left: 220px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const GlyphSection = styled.div`
  padding-top: 4px;
  margin-top: -4px;
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
        <Navigation />
        <Main>
          <Header>
            <H2>{name}</H2>
            <Link href={`/${name}`} legacyBehavior>
              <Anchor>CMap をダウンロード</Anchor>
            </Link>
            <Link href={`/${name}.json`} legacyBehavior>
              <Anchor>JSON 形式でダウンロード</Anchor>
            </Link>
          </Header>
          {supplements.map(({ type, supplement, color }, index) => (
            <GlyphSection id={type} key={type}>
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
            </GlyphSection>
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
