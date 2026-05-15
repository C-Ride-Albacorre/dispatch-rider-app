export const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');

  return `${name.slice(0, 4)}****@${domain}`;
};

export const maskPhone = (phone: string ) => {
  return `${phone.slice(0, 6)}****${phone.slice(-4)}`;
};



