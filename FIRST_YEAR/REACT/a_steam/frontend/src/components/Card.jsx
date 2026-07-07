
import { Card as MuiCard, CardContent, CardHeader, CardActions, Divider } from '@mui/material';

const Card = ({ title, subheader, children, actions, className = '', noPadding = false }) => {
  return (
    <MuiCard className={`overflow-hidden ${className}`}>
      {(title || subheader) && (
        <>
          <CardHeader 
            title={title} 
            subheader={subheader}
            titleTypographyProps={{ className: 'font-bold text-lg dark:text-gray-100' }}
            subheaderTypographyProps={{ className: 'dark:text-gray-400' }}
            className="pb-2 pt-4 px-6"
          />
          <Divider className="dark:border-gray-700" />
        </>
      )}
      
      <CardContent className={`${noPadding ? 'p-0' : 'p-6'} dark:text-gray-300`}>
        {children}
      </CardContent>

      {actions && (
        <>
          <Divider className="dark:border-gray-700" />
          <CardActions className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
            {actions}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
};

export default Card;
