import { Grid, Card, Code, Page, Text } from "@geist-ui/core";
import { Link } from "react-router-dom";

export default function Root() {
  return (
    <Page>
      <Text h1>
        <Code>@open-policy-agent/opa-react</Code> Demos
      </Text>
      <Grid.Container gap={1.5}>
        <Grid xs={12} justify="center">
          <Card width="100%">
            <Text h4 my={0}>
              Batching
            </Text>
            <Text>
              This demo shows the batching support in{" "}
              <Code>@open-policy-agent/opa-react</Code>
            </Text>
            <Card.Footer>
              <Link color to="batch">
                Go to demo
              </Link>
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
      <Page.Footer>
        <Link
          color
          target="_blank"
          to="https://github.com/open-policy-agent/opa-sdk-demos/tree/main/opa-react-demo"
        >
          Visit source code on GitHub.
        </Link>
      </Page.Footer>
    </Page>
  );
}
