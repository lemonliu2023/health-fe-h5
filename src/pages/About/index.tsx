import { Page, Navbar, Block, BlockTitle, Actions, ActionsButton, ActionsGroup, ActionsLabel, Button, f7 } from 'framework7-react';
import { useState } from 'react';

const AboutPage = () => {
  console.log(f7);
  const [actionsOneGroupOpened, setActionsOneGroupOpened] = useState(false);
  return (
    <Page onPageAfterOut={() => console.log('Page after out')}>
      <Navbar title="About" backLink="Back" />
      <BlockTitle>About My App</BlockTitle>
      <Block>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni molestiae laudantium dignissimos est nobis delectus nemo ea alias voluptatum
          architecto, amet similique, saepe iste consectetur in repellat ut minus quibusdam!
        </p>
        <p>
          Molestias et distinctio porro nesciunt ratione similique, magni doloribus, rerum nobis, aliquam quae reiciendis quasi modi. Nam a recusandae, fugiat
          in ea voluptates fuga eius, velit corrupti reprehenderit dignissimos consequatur!
        </p>
        <p>
          Blanditiis, cumque quo adipisci. Molestiae, dolores dolorum quos doloremque ipsa ullam eligendi commodi deserunt doloribus inventore magni? Ea
          mollitia veniam nostrum nihil, iusto doloribus a at! Ea molestiae ullam delectus!
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni molestiae laudantium dignissimos est nobis delectus nemo ea alias voluptatum
          architecto, amet similique, saepe iste consectetur in repellat ut minus quibusdam!
        </p>
        <p>
          Molestias et distinctio porro nesciunt ratione similique, magni doloribus, rerum nobis, aliquam quae reiciendis quasi modi. Nam a recusandae, fugiat
          in ea voluptates fuga eius, velit corrupti reprehenderit dignissimos consequatur!
        </p>
        <p>
          Blanditiis, cumque quo adipisci. Molestiae, dolores dolorum quos doloremque ipsa ullam eligendi commodi deserunt doloribus inventore magni? Ea
          mollitia veniam nostrum nihil, iusto doloribus a at! Ea molestiae ullam delectus!
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni molestiae laudantium dignissimos est nobis delectus nemo ea alias voluptatum
          architecto, amet similique, saepe iste consectetur in repellat ut minus quibusdam!
        </p>
        <p>
          Molestias et distinctio porro nesciunt ratione similique, magni doloribus, rerum nobis, aliquam quae reiciendis quasi modi. Nam a recusandae, fugiat
          in ea voluptates fuga eius, velit corrupti reprehenderit dignissimos consequatur!
        </p>
        <p>
          Blanditiis, cumque quo adipisci. Molestiae, dolores dolorum quos doloremque ipsa ullam eligendi commodi deserunt doloribus inventore magni? Ea
          mollitia veniam nostrum nihil, iusto doloribus a at! Ea molestiae ullam delectus!
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni molestiae laudantium dignissimos est nobis delectus nemo ea alias voluptatum
          architecto, amet similique, saepe iste consectetur in repellat ut minus quibusdam!
        </p>
        <p>
          Molestias et distinctio porro nesciunt ratione similique, magni doloribus, rerum nobis, aliquam quae reiciendis quasi modi. Nam a recusandae, fugiat
          in ea voluptates fuga eius, velit corrupti reprehenderit dignissimos consequatur!
        </p>
        <p>
          Blanditiis, cumque quo adipisci. Molestiae, dolores dolorum quos doloremque ipsa ullam eligendi commodi deserunt doloribus inventore magni? Ea
          mollitia veniam nostrum nihil, iusto doloribus a at! Ea molestiae ullam delectus!
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni molestiae laudantium dignissimos est nobis delectus nemo ea alias voluptatum
          architecto, amet similique, saepe iste consectetur in repellat ut minus quibusdam!
        </p>
        <p>
          Molestias et distinctio porro nesciunt ratione similique, magni doloribus, rerum nobis, aliquam quae reiciendis quasi modi. Nam a recusandae, fugiat
          in ea voluptates fuga eius, velit corrupti reprehenderit dignissimos consequatur!
        </p>
        <p>
          Blanditiis, cumque quo adipisci. Molestiae, dolores dolorum quos doloremque ipsa ullam eligendi commodi deserunt doloribus inventore magni? Ea
          mollitia veniam nostrum nihil, iusto doloribus a at! Ea molestiae ullam delectus!
        </p>
      </Block>
      <Button fill onClick={() => setActionsOneGroupOpened(true)}>
        One group
      </Button>
      {/* One Group */}
      <Actions opened={actionsOneGroupOpened} onActionsClosed={() => setActionsOneGroupOpened(false)}>
        <ActionsGroup>
          <ActionsLabel>Do something</ActionsLabel>
          <ActionsButton strong>Button 1</ActionsButton>
          <ActionsButton>Button 2</ActionsButton>
          <ActionsButton color="red">Cancel</ActionsButton>
        </ActionsGroup>
      </Actions>
    </Page>
  );
};

export default AboutPage;
