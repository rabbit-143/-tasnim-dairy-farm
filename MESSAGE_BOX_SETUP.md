# Message Box Setup ✉️

## What's Been Added

A complete **Message Management System** has been added to your admin panel. When someone submits a message through your contact form, you can now see it and manage it from the admin dashboard.

### Features:

✅ **View All Messages** - See all contact messages in one place  
✅ **Unread Badge** - Messages show unread status with visual indicators  
✅ **Search & Filter** - Filter by read/unread and search by name, email, subject  
✅ **Message Details** - Click any message to view full details  
✅ **Mark as Read** - Automatically marks messages as read when viewed  
✅ **Quick Actions** - Email and phone quick links  
✅ **Delete Messages** - Remove messages you don't need  
✅ **Dashboard Widget** - See unread message count on main dashboard  
✅ **Auto-refresh** - Dashboard updates every 30 seconds  

---

## Files Created/Modified

### New Files:
- `src/admin/AdminMessages.tsx` - Complete message management component

### Modified Files:
- `src/pages/AdminPanel.tsx` - Added Messages navigation and routing
- `src/admin/AdminDashboard.tsx` - Added message count widget

### Backend Files (Already Set Up):
- `backend/routes/contact.js` - API endpoints for messages
- `backend/database.js` - Database table for storing messages

---

## How to Use

### 1. Access Messages
In your admin panel, click on **"Messages"** in the sidebar navigation.

### 2. View Message Overview
You'll see statistics at the top:
- **Total Messages** - All messages received
- **Unread** - Messages you haven't opened yet
- **Read** - Messages you've already viewed

### 3. Search & Filter Messages
- Type in the search box to find specific messages
- Use filter buttons: **All**, **Unread**, **Read**

### 4. View Message Details
- Click any message in the left panel to see full details
- The message will automatically be marked as read
- See sender's email, phone (if provided), subject, and full message

### 5. Take Action
- **Email Link** - Click the email address to compose a reply
- **Phone Link** - Click the phone to call or add to contacts
- **Delete** - Remove the message if not needed
- **Reply** - Use your email client to respond to the sender

---

## API Reference

The backend provides these endpoints for contact messages:

```
POST /api/contact/
- Submit a new contact message

GET /api/contact/messages
- Get all messages (sorted newest first)

GET /api/contact/messages/:id
- Get a specific message by ID

PUT /api/contact/messages/:id/read
- Mark message as read

DELETE /api/contact/messages/:id
- Delete a message
```

---

## Dashboard Integration

On your **Admin Dashboard**, you'll now see:
- **"New Messages"** card showing unread message count
- Count updates every 30 seconds automatically
- Click the card to jump directly to Messages section

---

## Database Schema

Messages are stored with this structure:
```
id (integer) - Message ID
name (text) - Sender's name
email (text) - Sender's email
phone (text) - Sender's phone (optional)
subject (text) - Message subject (optional)
message (text) - Message content
is_read (integer) - 0 = unread, 1 = read
created_at (text) - When message was received
```

---

## Tips & Best Practices

1. **Check Regularly** - Review unread messages from your dashboard
2. **Organize** - Mark spam/invalid messages as read to keep focus
3. **Delete Old** - Remove messages older than 3 months to keep database lean
4. **Reply Quickly** - Use the email link for fastest response
5. **Mobile Friendly** - Message interface works on mobile too

---

## Troubleshooting

### Messages Not Appearing?
- Make sure backend server is running (`npm start` in `/backend`)
- Check that your database is initialized
- Verify browser console for fetch errors

### Can't Delete?
- Check if you're logged in as admin
- Verify backend server connection

### Search Not Working?
- Try clearing the search box and typing again
- Make sure at least 1 message exists

---

## Next Steps

You can customize this further by:
- Adding email notifications when new messages arrive
- Creating message categories
- Adding message priority levels
- Integrating with email service (Gmail, SendGrid, etc.)

---

**Happy managing! Your contact messages are now organized and accessible.** 📧

