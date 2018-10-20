# Dining room front end

## About
This repository contains a react app that allows a user to select dishes for two diners from a supplied menu, as well as its corresponding tests.

## Getting started
To select a diner, click on their portrait. Once this is done, their dishes can be selected by clicking on their menu. To remove the selection, click the dish again. This assures that each dish can only be selected once per customer.

On the bottom of the main screen and the menu screen, the total price is shown, which updates as dishes are added or removed. In addition, this area will also show any problems with the order if there happen to be any.

To leave the menu screen either click the grayed out zone outside the menu, or the 'x' button on the top right of the menu.

## Instructions
To install the node modules, run `npm install`

To test this application, run `npm test`

To start this application, run `npm start`

The application will be available to use on `http://localhost:8080/`

## Notes
The application is written in such a way that the amount of diners is dependent on a single property of the App component, rendering it very flexible.

Styles have been written in scss, and imported by increasing the functionality of the webpack config.

Tests have been written using jest