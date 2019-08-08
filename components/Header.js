import React from "react";
import { Dropdown, Icon, Menu, Segment } from "semantic-ui-react";

export default () => {
  return (
    <div>
      <link
        rel="stylesheet"
        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
      />
      <Menu
        borderless
        fitted
        inverted
        attached="top"
        color="black"
        style={{ marginTop: "10px" }}
      >
        <Menu.Item>Betoken</Menu.Item>
        <Menu.Item>Today's Games</Menu.Item>
        <Menu.Item>Open Bets</Menu.Item>

        <Menu.Menu position="right">
          <div className="ui right aligned category search item">
            <div className="ui transparent icon input">
              <input
                className="prompt"
                type="text"
                placeholder="Search sport games..."
              />
              <i className="search link icon" />
            </div>
            <div className="results" />
          </div>
        </Menu.Menu>

        <Dropdown item icon="wrench" simple>
          <Dropdown.Menu style={{ left: "auto", right: 0 }}>
            <Dropdown.Header>"Current Username"</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Header>Balance</Dropdown.Header>
            <Dropdown.Item>Current Bets</Dropdown.Item>
            <Dropdown.Item>Past Bets</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Settings</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </div>
  );
};
