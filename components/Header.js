import React from "react";
import { Dropdown, Icon, Menu, Segment } from "semantic-ui-react";

export default () => {
  return (
    <div>
      <Menu style={{ marginTop: "10px" }}>
        <Menu.Item>Betoken</Menu.Item>

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
            <Dropdown.Item>
              <Icon name="dropdown" />
              <span className="text">New</span>

              <Dropdown.Menu>
                <Dropdown.Item>Document</Dropdown.Item>
                <Dropdown.Item>Image</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
            <Dropdown.Item>Open</Dropdown.Item>
            <Dropdown.Item>Save...</Dropdown.Item>
            <Dropdown.Item>Edit Permissions</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Export</Dropdown.Header>
            <Dropdown.Item>Share</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </div>
  );
};
