import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Logo from '../Components/Logo';
import { MHidden } from '../Components/@material-extend';

const HeaderStyle = styled('header')(({ theme }) => ({
   top: 0,
   zIndex: 9,
   lineHeight: 0,
   width: '100%',
   display: 'flex',
   alignItems: 'center',
   position: 'absolute',
   padding: theme.spacing(3),
   justifyContent: 'space-between',
   [theme.breakpoints.up('md')]: {
      alignItems: 'flex-start',
      padding: theme.spacing(7, 5, 0, 7)
   }
}));

AuthLayout.propTypes = {
   children: PropTypes.node
};

export default function AuthLayout({ children }) {
   return (
      <HeaderStyle>
         <Logo />

         <MHidden width='smDown'>
            <Typography
               variant='body2'
               sx={{
                  mt: { md: -2 }
               }}
            >
               {children}
            </Typography>
         </MHidden>
      </HeaderStyle>
   );
}
