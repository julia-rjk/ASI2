import React from 'react';
import { Grid, Card, Title, Text, Space } from '@mantine/core';
import './Home.css';
import { Link } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';

export const Home = () => {
  const menuItems = useMenu();

  return (
    <Grid grow>
      {menuItems.map((item, index) => (
        <Grid.Col key={index} span={6}>
          <Card
            component={Link}
            to={item.path}
            shadow="sm"
            radius="md"
            className="card">
            <Title className="title">
              {item.icon}
              <Space w="lg" />
              <Text>{item.name}</Text>
            </Title>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};
