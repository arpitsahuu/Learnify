"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<string | null>("Payment Successful");
  const [orderId, setOrderId] = useState<string | null>('Payment Failed');
  const [amount, setAmount] = useState<number | null>(null);
  // setPaymentStatus('Payment Successful');
  // setPaymentStatus('Payment Failed');
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px',
    }}
  >
    <Typography variant="h4" gutterBottom>
      {paymentStatus}
    </Typography>
    {paymentStatus === 'Payment Successful' && (
      <>
        <Typography variant="h6" gutterBottom>
          Your payment was successful!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Order ID: {orderId}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Amount Paid: ₹{amount}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')} // Redirect to homepage or any other page
        >
          Go to Homepage
        </Button>
      </>
    )}
    {paymentStatus === 'Payment Failed' && (
      <Typography variant="h6" gutterBottom>
        Something went wrong with your payment. Please try again.
      </Typography>
    )}
  </Box>
  );
}