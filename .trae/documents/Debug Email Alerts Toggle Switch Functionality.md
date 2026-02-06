## Issue Analysis
The Email Alerts toggle switch on the Account Settings page is currently hardcoded to `checked` and has no functionality. It's just a static UI element without state management or interactivity.

## Solution Plan

### Step 1: Add Email Alerts State to AppContext
- Add a new state variable `emailAlerts` in `AppContext.jsx` to track email alerts status
- Add a `toggleEmailAlerts` function to manage the state
- Add localStorage persistence for the email alerts setting
- Include the new state and function in the context value

### Step 2: Update Settings Component
- Modify the Email Alerts toggle switch in `Settings.jsx` to use the new state
- Add an `onChange` handler to call the `toggleEmailAlerts` function
- Remove the hardcoded `checked` attribute and replace it with the state value

### Step 3: Test the Functionality
- Verify that the toggle switch can be turned on and off
- Confirm that the state is persisted in localStorage
- Ensure that the toggle state is correctly loaded on page refresh
- Test the functionality in both light and dark modes

## Expected Outcome
After implementing these changes, the Email Alerts toggle switch will:
- Be interactive and respond to user clicks
- Maintain its state across page refreshes
- Properly reflect the current email alerts status
- Work consistently in both light and dark modes