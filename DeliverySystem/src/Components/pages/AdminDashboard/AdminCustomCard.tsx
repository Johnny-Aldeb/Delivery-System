import { Card, Typography } from "@mui/material";

export const AdminCustomCard = ({ title, first, second, third }) => {
  return (
    <Card className="card-content" sx={{ boxShadow: "none" }}>
      <Typography variant="h6" p={1} sx={{ fontFamily: '"Montserrat", serif' }}>
        {title}
      </Typography>
      <Typography p={"5px"} sx={{ fontFamily: '"Montserrat", serif' }}>
        {first}
      </Typography>
      <Typography p={"5px"} sx={{ fontFamily: '"Montserrat", serif' }}>
        {second}
      </Typography>
      <Typography
        p={"5px"}
        sx={{ fontFamily: '"Montserrat", serif', maxWidth: "200px" }}
      >
        {third}
      </Typography>
    </Card>
  );
};
