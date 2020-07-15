function Settings(props){
  return (
    <Page>
      <Section
        title={<Text bold align="center">Minimal Settings</Text>}>
         <Toggle
          settingsKey="hideHeartRate"
          label="Hide heart rate"
        />
         <Toggle
          settingsKey="hideBattery"
          label="Hide battery level"
        />
         <Toggle
          settingsKey="hideDate"
          label="Hide date"
        />
        <ColorSelect
          settingsKey="fontColor"
          colors={[
            {color: 'lime'},
            {color: 'darkseagreen'},
            {color: 'green'},
            {color: 'red'},
            {color: 'crimson'},
            {color: 'lightcoral'},
            {color: 'yellow'},
            {color: 'gold'},
            {color: 'lemonchiffon'},
            {color: 'orange'},
            {color: 'deepskyblue'},
            {color: 'skyblue'},
            {color: 'blue'}         
            
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Settings);