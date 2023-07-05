import React from 'react'
import {Paper,Grid,Card,CardActionArea,CardMedia,CardContent} from '@mui/material';
import {Link} from 'react-router-dom';
import c1 from '../images/c1.png';
 import c2 from '../images/c2.png';
 import c3 from '../images/c3.png';
 import Slider from "react-slick";
const Setweightdasboard = () => {
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
  return (
    <div>
      <Paper elevation={5}sx={{padding:'30px',height:'478px',marginTop:'30px',marginBottom:'30px',marginLeft:'20px',marginRight:'20px'}}>
    {/* <div className='container'> */}
    <Grid container spacing={2} alignContent="center">
<Grid item md={12} sx={{marginTop:'50px'}} >
    {/* <Slider {...settings}>
      <div className='card'>
            <Link to='/setweight' style={{textDecoration: 'none'}}>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c1}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
          <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
    </Link>
          </div>
          <div className='card'>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c2}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
          <div className='card'>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c3}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div> 
          </Slider> */}
           <Slider  {...settings}>
          <div>
            <Link to='/courseplan' style={{textDecoration: 'none'}}>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c1}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
          <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
    </Link>
          </div>
          <div>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c2}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
          <div>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c3}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
          <div>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c1}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
          <div>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c1}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
          <div>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c1}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
          <div>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c1}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
          <div>
          <Card sx={{ maxWidth: 270 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={c1}
          alt="green iguana"
        >
        </CardMedia>
        <div style={{position: "absolute", color: "white",top: 35
        ,marginLeft:'15px'}}className='corstext'>SE242SP23</div>
        <div className='corstext2'style={{position: "absolute", color: "white",top: 60
        ,marginLeft:'15px'}}>Software Engineering</div>
         <div className='corstext3'style={{position: "absolute",top: 165
        ,marginLeft:'18px'}}>Department of Computing</div>
        <CardContent>
        <p className='course' gutterBottom component="div">
            Mr Muhammad Usman
          </p>
        </CardContent>
      </CardActionArea>
    </Card>
          </div>
        </Slider>
          </Grid>
</Grid>
          {/* </div> */}
      </Paper>
    </div>
  )
}

export default Setweightdasboard;
