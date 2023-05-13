import Link from "next/link";
import styled from "styled-components";
import { Anchor } from "./Parts";
import { cmaps } from "@/cmap";

const Wrapper = styled.nav`
  padding-left: 40px;
  position: fixed;
  left: 0;
`;

const H1 = styled.h1`
  line-height: 1;
  font-size: 20px;
  margin: 0 0 16px 0;
`;

const Group = styled.div`
  margin-bottom: 24px;
`;

const H3 = styled.h3`
  font-size: 16px;
  margin: 0;
`;

const List = styled.ul`
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Navigation = () => (
  <Wrapper>
    <H1>cmap-display</H1>
    <H3>Adobe-Japan 1-7</H3>
    <Group>
      <List>
        {cmaps.map(({ name }) => (
          <li key={name}>
            <Link href={`/cmap/${name}`} legacyBehavior>
              <Anchor>{name}</Anchor>
            </Link>
          </li>
        ))}
      </List>
    </Group>
    <Group>
      <H3>文字セット</H3>
      <List>
        <li>
          <Anchor href="#std">Std</Anchor>
        </li>
        <li>
          <Anchor href="#pro">Pro</Anchor>
        </li>
        <li>
          <Anchor href="#pr5">Pr5</Anchor>
        </li>
        <li>
          <Anchor href="#pr6">Pr6</Anchor>
        </li>
      </List>
    </Group>
    <Group>
      <Anchor href="https://github.com/inaniwaudon/cmap-display">GitHub</Anchor>
    </Group>
  </Wrapper>
);

export default Navigation;
