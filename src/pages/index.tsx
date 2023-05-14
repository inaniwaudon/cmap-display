import Link from "next/link";
import styled from "styled-components";
import { cmaps } from "@/cmap";
import { Anchor } from "@/components/Parts";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 24px 32px;
`;

const Footnote = styled.aside`
  border-top: solid 1px #ccc;
`;

const Index = () => (
  <Wrapper>
    <h1>cmap-display</h1>
    <p>
      本サイトでは、Adobe-Japan 1-7 に準拠した CMap に基づく対応表を提供します。
    </p>
    <ul>
      {cmaps.map((cmap) => (
        <li key={cmap.name}>
          <Link href={`/cmap/${cmap.name}`} legacyBehavior>
            <li>
              <Anchor>{cmap.name}</Anchor>
            </li>
          </Link>
        </li>
      ))}
    </ul>
    <article>
      <h2>CMap とは？</h2>
      <p>
        フォント内部ではグリフに対して CID（Character
        Identifer）と呼ばれる番号が割り振られています。この CID と Unicode
        を始めとする文字コードとの関連を示した表が CMap です。
      </p>
      <p>
        例えば、「UniJIS-UTF16-H」であれば、UTF-16 から CID
        への対応表が含まれています。末尾が「-V」のものは、縦組み用グリフを示します。
      </p>
      <h2>Adobe-Japan1 とは？</h2>
      <p>
        Adobe
        が定めた日本語の文字コレクションで、日本語フォントが準拠する文字コレクションのデファクトスタンダードとなっています
        <sup>[1]</sup>。1-
        に続く番号は追補（Supplement）と呼ばれ、これが変わると収録されるグリフ数が変化します。
      </p>
      <p>
        例えば macOS 等に搭載されているヒラギノ角ゴシックは、ヒラギノ角ゴ
        Std、ヒラギノ角ゴ Pro
        と末尾にバージョンが付されています。これが文字コレクションを表したものです。Std
        であれば Adobe-Japan1-3 に含まれる 9,354 グリフが、Pro であれば
        Adobe-Japan1-4 に含まれる 15,444 グリフが含まれています。
      </p>
      <h3>StdN と JIS2004 字形</h3>
      <p>
        Std, Pro 等「N」の表記がないフォントでは JIS90 字形が、StdN, ProN
        等の末尾に「N」が付されたフォントでは JIS2004
        字形が採用されています。字形の差は 葛飾区
        の「葛」の下の部分等に顕著に現れています。この差を CMap
        で確認すると、UniJIS-UTF16-H で「葛」（U+845B）が CID 1481
        に割り当てられているのに対し、UniJIS2004-UTF16-H では CID 7652
        に割り当てられており、それぞれ別の Unicode と CID
        が紐づいていることが読み取れます<sup>[2]</sup>。
      </p>
    </article>
    <Footnote>
      <small>
        <p>
          [1] 近年では源ノ角ゴシックのように、独自の文字コレクション（Adobe
          Identify-0）を採用するケースも存在します。
        </p>
        <p>[2] 技術的な都合で本サイト上でグリフの書き分けはできていません。</p>
      </small>
    </Footnote>
  </Wrapper>
);

export default Index;
