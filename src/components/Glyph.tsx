import styled from "styled-components";

const Wrapper = styled.div`
  width: 60px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
`;

const CharWrapper = styled.div`
  margin-bottom: 8px;
`;

const Char = styled.div<{ vertical: boolean }>`
  height: 60px;
  line-height: 1;
  font-size: 60px;
  border-bottom: solid 1px #999;
  writing-mode: ${({ vertical }) =>
    vertical ? "vertical-rl" : "horizontal-tb"};
  display: inline-block;w
`;

const Details = styled.div`
  font-size: 14px;
`;

interface GlyphProps {
  unicode: number;
  cid: number;
  vertical: boolean;
}

export const Glyph = ({ unicode, cid, vertical }: GlyphProps) => {
  const utfHex = unicode.toString(16).toUpperCase();
  return (
    <Wrapper>
      <CharWrapper>
        <Char vertical={vertical}>{String.fromCodePoint(unicode)}</Char>
      </CharWrapper>
      <Details>
        <div>{"U+" + ("0000" + utfHex).slice(-Math.max(4, utfHex.length))}</div>
        <div>{cid}</div>
      </Details>
    </Wrapper>
  );
};
