import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const plans = [
  {
    title: 'Free',
    price: '0',
    features: [
      'Access to basic courses',
      'Interactive whiteboard',
      'Community support'
    ],
    buttonText: 'Get Started',
    highlighted: false
  },
  {
    title: 'Pro',
    price: '10',
    features: [
      'Everything in Free',
      'Advanced courses',
      'Priority support',
      'Course creation tools'
    ],
    buttonText: 'Try Pro',
    highlighted: true
  },
  {
    title: 'Enterprise',
    price: '25',
    features: [
      'Everything in Pro',
      'Custom branding',
      'API access',
      'Dedicated support'
    ],
    buttonText: 'Try Enterprise',
    highlighted: false
  }
];

const Payment: React.FC = () => {
  return (
    <Box 
      id="pricing" // Make sure this ID exists
      sx={{ py: 12, backgroundColor: '#121212' }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            mb: 8,
            fontWeight: 600,
            fontSize: { xs: '3 rem', md: '4rem' },
            color: '#fff'
          }}
        >
          Choose Your Plan
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4
        }}>
          {plans.map((plan, index) => (
            <Paper
              key={index}
              sx={{
                p: 4,
                height: '450px',
                backgroundColor: plan.highlighted ? 'rgba(181, 131, 26, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                border: plan.highlighted ? '1px solid #b5831a' : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{ color: '#fff', mb: 2 }}
                >
                  {plan.title}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: '#b5831a', mb: 4 }}
                >
                  ${plan.price}
                  <Typography component="span" sx={{ color: '#666', fontSize: '1rem' }}>/month</Typography>
                </Typography>
                <Box sx={{ mb: 4 }}>
                  {plan.features.map((feature, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleIcon sx={{ color: '#b5831a', mr: 1, fontSize: '1.2rem' }} />
                      <Typography sx={{ color: '#fff' }}>{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Button
                variant={plan.highlighted ? 'contained' : 'outlined'}
                fullWidth
                sx={{
                  mt: 'auto',
                  py: 1.5,
                  backgroundColor: plan.highlighted ? '#b5831a' : 'transparent',
                  borderColor: '#b5831a',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: plan.highlighted ? '#a57318' : 'rgba(181, 131, 26, 0.1)',
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Payment;
