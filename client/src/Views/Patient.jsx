import React from "react";
import ProfileCard from "../Profile/ProfileCards";
function Patient(props) {
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
