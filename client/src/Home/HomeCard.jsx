import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css';
function HomeCard(props) {
  const navigate = useNavigate();
  return (
    <Card
      title={props.title}
      className='card-container card-shadow'
      onClick={() => navigate(props.path)}
    >
      <div
        style={{
          backgroundImage: `url(${props.icon})`,
        }}
        className='card-content'
      >
        {props.isCalendar ? (
          <>
            <p className='m-0 calendar-card-day'>
              {new Date().toLocaleString('en-US', { day: '2-digit' })}
            </p>
          </>
        ) : (
          ''
        )}
      </div>
    </Card>
  );
}

export default HomeCard;
