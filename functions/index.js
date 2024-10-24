const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Set up Nodemailer with your email provider
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'signetprintza@gmail.com',
        pass: 'lsexfdrgcfusmgmd'
    }
});

// Cloud Function to send an email when the status is updated to "Received"
exports.sendEmailOnStatusChange = functions.firestore
    .document('print_requests/{requestId}')  // Correct this line
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // Check if the status has been updated to "Received"
        if (newValue.status === 'Received' && previousValue.status !== 'Received') {
            const email = newValue.customer_email;
            const orderId = context.params.requestId;
            const totalPrice = newValue.totalPrice;
            const storeName = newValue.storeName;
            const files = newValue.files;

            // Get all file details
            const fileDetails = files.map(file => `
                <tr>
                    <td>${file.name}</td>
                    <td>${file.colour}</td>
                    <td>${file.paperSize}</td>
                    <td>${file.doubleSided}</td>
                    <td>${file.paperThickness}</td>
                    <td>${file.price}</td>
                    <td>${file.quantity}</td>
                </tr>
            `).join('');

            // Send confirmation email
            const mailOptions = {
                from: 'signetprintza@gmail.com',
                to: email,
                subject: `Signet Print Request #${orderId} - Received`,
                html: `
       <table role="presentation" width="100%" style="background-color: #f8f8f8; padding: 20px; border-collapse: collapse;">
            <tr>
                <td align="center">
                    <div style="font-family: Arial, sans-serif; font-size: 17px; width: 700px; border: 1px solid #ccc; border-radius: 10px; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                        <h2 style="text-align: center; font-size: 20px;">Your print request has been received.</h2>
                        <h3 style="margin-top: 10px;"></h3>
                        <hr style="border: 1px solid #ccc;" />
                        <p style="text-align: left;"><strong>Order ID:</strong> ${orderId}</p>
                        <hr style="border: 1px solid #ccc;" />
                        <p style="text-align: left;"><strong>Total Price:</strong> ${totalPrice} R</p>
                        <hr style="border: 1px solid #ccc;" />
                        <p style="text-align: left;"><strong>Store Name:</strong> ${storeName}</p>
                        <hr style="border: 1px solid #ccc;" />
                        <p style="text-align: left;"><strong>Files:</strong></p>
                                <table border="1" cellpadding="5" style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>Color</th>
                                            <th>Paper Size</th>
                                            <th>Double Sided</th>
                                            <th>Paper Thickness</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${fileDetails}
                                    </tbody>
                                </table>
                        <hr style="border: 1px solid #ccc;" />
                        <p style="text-align: center;">Thank you for using our service!</p>
                    </div>
                </td>
            </tr>
        </table>
    `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('Email sent successfully to:', email);
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }
    });
