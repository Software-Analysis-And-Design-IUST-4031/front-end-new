import { useState } from "react"
import { Drawer, ScrollArea, Stack, Button, MantineProvider } from '@mantine/core'
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const navigate = useNavigate()
    const [DrawerOpened,setDrawerOpened] = useState(false);
    return (
      <MantineProvider>
        <Button
          onClick={() => setDrawerOpened(true)}
          style={{position: 'absolute', top: 20, left: 20, backgroundColor: 'black'}}>
            open sidebar
        </Button>
        <Drawer 
          opened={DrawerOpened} 
          onClose={() => setDrawerOpened(false)}
          title="SideBar"
          position="left"
          style={{width: '2900px', marginLeft: '0px'}}
          size="20%">
            <ScrollArea style={{
                height: '100%'
            }}>
              <Stack style={{gap: '16px'}}>
                <Button>Privacy</Button>
                <Button>Edit Profile</Button>
                <Button>Theme</Button>
              </Stack>
            </ScrollArea>
        </Drawer>
      </MantineProvider>
  );
}

export default SideBar