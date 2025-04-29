import React, { useEffect } from 'react';
import { AuthService } from '../services/AuthService';

function Home() {
  async function getProfile() {
    await AuthService.getProfile();
  }

  useEffect(() => {
    getProfile();
  }, []);

  return <>Home</>;
}

export default Home;
