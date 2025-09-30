# User Guide

Welcome to the Kansai Dialect Accent Dictionary! This guide will help you understand how to use all the features of the application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Searching for Words](#searching-for-words)
3. [Understanding Accent Patterns](#understanding-accent-patterns)
4. [Admin Features](#admin-features)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Application

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You will see the main page with three tabs:
   - **検索 (Search)** - Search for words
   - **単語登録 (Word Registration)** - Add new words (admin only)
   - **管理 (Admin)** - Admin login and management

---

## Searching for Words

### Basic Search

1. Make sure you're on the **検索 (Search)** tab
2. Enter a word in the search box (e.g., "こんにちは")
3. Click the **検索 (Search)** button or press Enter
4. The result will display:
   - The word in large text
   - Accent pattern with directional markers
   - Pronunciation guide
   - Example usage sentence

### Using the Clear Button

- Click the **クリア (Clear)** button to:
  - Clear the search input
  - Hide the search results
  - Start a new search

### When a Word is Not Found

If a word doesn't exist in the dictionary, you'll see a message:
```
申し訳ございません。該当する単語が見つかりませんでした。
別の単語を試してみてください。
```

**What to do:**
- Try a different word
- Check your spelling
- If you're an admin, you can add the word to the dictionary

---

## Understanding Accent Patterns

The application uses special markers to show Kansai dialect accent patterns:

### Accent Markers

- **↗ (Red Up Arrow)**: Indicates rising pitch
- **↘ (Blue Down Arrow)**: Indicates falling pitch

### Example

For the word "こんにちは":
- Display: `こん↗に↘ちは`
- This means:
  - Start at a base pitch
  - Raise pitch at "こん"
  - Lower pitch at "に"
  - Continue at lower pitch for "ちは"

### Pronunciation

The pronunciation field shows how the word is actually pronounced in Kansai dialect, which may differ from standard Japanese.

Example:
- Word: ありがとう
- Pronunciation: おおきに

---

## Admin Features

### Logging In

1. Click the **管理 (Admin)** tab
2. You'll see the login form with test credentials displayed
3. Enter your credentials:
   - Username: `admin`
   - Password: `secret`
4. Click **ログイン (Login)** or press Enter

**Quick Login Option:**
- Click the **クイックログイン (Quick Login)** button to automatically fill in the test credentials and log in

### After Logging In

Once logged in, you'll see the Admin Panel with:
- Welcome message with your username
- Status indicators showing your permissions
- Logout button
- Word list section

---

### Registering New Words

1. After logging in, click the **単語登録 (Word Registration)** tab
2. Fill in all fields:
   - **単語 (Word)**: The word in Japanese
   - **関西弁アクセント (Kansai Accent)**: The word with accent markers (↗↘)
   - **発音 (Pronunciation)**: How it's pronounced
   - **使用例 (Example)**: A sentence using the word
3. Click **登録 (Register)** to save
4. Click **クリア (Clear)** to reset the form

**Tips:**
- Use ↗ for rising pitch and ↘ for falling pitch
- Provide clear, natural example sentences
- Double-check your input before registering

---

### Viewing All Words

1. Log in as admin
2. Go to the **管理 (Admin)** tab
3. Click **一覧を表示 (Display List)** button
4. All registered words will appear in a table

**Table Columns:**
- Word
- Accent pattern
- Pronunciation
- Example usage
- Actions (Edit/Delete buttons)

### Filtering Words

After displaying the word list:
1. Use the filter input box that appears
2. Type any part of a word to filter the list
3. The table updates in real-time as you type
4. Clear the filter box to show all words again

---

### Editing Words

**Method 1: From Search Results**
1. Search for a word
2. When logged in as admin, you'll see an **編集 (Edit)** button
3. Click to open the edit modal
4. Modify any fields
5. Click **保存 (Save)** or **キャンセル (Cancel)**

**Method 2: From Word List**
1. Display the word list in the Admin panel
2. Find the word you want to edit
3. Click the **編集 (Edit)** button in that row
4. Modify the fields in the modal
5. Click **保存 (Save)** to confirm

**Edit Modal:**
- All fields are pre-filled with current values
- All fields are required
- Click the **×** button or outside the modal to close without saving
- The word list auto-refreshes after saving

---

### Deleting Words

**Method 1: From Search Results**
1. Search for a word
2. When logged in as admin, you'll see a **削除 (Delete)** button
3. Click the button
4. Confirm the deletion in the dialog
5. The word will be removed from the database

**Method 2: From Word List**
1. Display the word list in the Admin panel
2. Find the word you want to delete
3. Click the **削除 (Delete)** button in that row
4. Confirm the deletion
5. The list auto-refreshes

**Warning:**
- Deletion is permanent and cannot be undone
- Always double-check before confirming deletion

---

### Logging Out

1. Click the **ログアウト (Logout)** button in the Admin panel
2. You'll be logged out and returned to normal user mode
3. Admin features will no longer be visible

---

## Troubleshooting

### Can't Login

**Problem:** Login fails with "Invalid credentials"

**Solutions:**
- Check that username is exactly: `admin`
- Check that password is exactly: `secret`
- Make sure Caps Lock is off
- Try using the Quick Login button

---

### Word Registration Fails

**Problem:** Can't register a new word

**Solutions:**
- Make sure you're logged in as admin
- Check that all fields are filled in
- Verify your session hasn't expired (try logging out and back in)
- Check the browser console for error messages

---

### Search Not Working

**Problem:** Search doesn't return results

**Solutions:**
- Check your spelling
- Try searching for a different word
- Refresh the page
- Check that the server is running

---

### Word List Not Displaying

**Problem:** Clicking "Display List" doesn't show words

**Solutions:**
- Make sure you're logged in as admin
- Check that words exist in the database
- Refresh the page
- Check browser console for errors

---

### Session Expired

**Problem:** Admin features stop working

**Solutions:**
- Sessions last 24 hours
- Log out and log back in
- Clear browser cookies if issues persist

---

## Keyboard Shortcuts

### Search Tab
- **Enter** in search box: Perform search

### Registration Tab
- **Ctrl + Enter** in example field: Submit registration

### Login
- **Enter** in password field: Submit login

---

## Best Practices

### For Regular Users
1. Use clear, simple search terms
2. Learn the accent marker system
3. Read the example sentences for context

### For Administrators
1. Always verify word accuracy before adding
2. Use consistent formatting for accent patterns
3. Provide natural, helpful example sentences
4. Regularly review and update existing entries
5. Keep login credentials secure
6. Log out when finished with admin tasks

---

## Mobile Usage

The application is fully responsive and works on mobile devices:
- Touch-friendly buttons
- Responsive table layout
- Optimized font sizes
- Scrollable word list

---

## Tips for Learning Kansai Dialect

1. **Pay attention to pitch patterns**: Kansai dialect often has different pitch accents than standard Japanese
2. **Use the examples**: The example sentences show natural usage
3. **Compare pronunciations**: Note differences between standard and Kansai pronunciation
4. **Practice regularly**: Use the search feature to look up words as you learn

---

## Support

If you encounter issues not covered in this guide:
1. Check the browser console for error messages
2. Verify the server is running
3. Try refreshing the page
4. Clear browser cache and cookies
5. Contact the administrator

---

## Version Information

This guide is for version 1.0 of the Kansai Dialect Accent Dictionary.

For technical documentation, see [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md)
For API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)