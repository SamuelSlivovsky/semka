import React, { useEffect } from 'react';
import ProfileCard from '../Profile/ProfileCards';
function Patient(props) {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div>
      <ProfileCard
        userData={props.userData}
        patientId={props.patientId}
      ></ProfileCard>
    </div>
  );
}
export default Patient;
