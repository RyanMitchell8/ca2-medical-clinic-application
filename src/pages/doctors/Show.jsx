import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router';

export default function Show() {
  const [doctor, setDoctor] = useState([]);
  const { id } = useParams();

  let token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `https://ca2-med-api.vercel.app/doctors/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctor(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, []);

  return <>Show doctor</>;
}
