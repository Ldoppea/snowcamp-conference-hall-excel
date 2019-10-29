# Snowcamp - ConferenceHall Excel Exporter

A helper project allowing to export ConferenceHall submissions to excel

## Getting Started

Retrieve your event ID in the event url : `https://conference-hall.io/public/event/<eventID>/`

Retrieve your API key from your ConferenceHall event : `https://conference-hall.io/organizer/event/<eventID>/edit/integrations`

In the Proposal view, click on the `Export...` button and choose `JSON File`. Copy the downloaded file in the project folder

Edit `excelConverter` and set `EXPORT_FILE`, `API_KEY` and `EVENT_ID` with corresconding data

Run the script

```
yarn

yarn start
```

The script should have generated a file named `ConferenceHall.xlsx`

## Built With

* [ConferenceHall](https://conference-hall.io)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

