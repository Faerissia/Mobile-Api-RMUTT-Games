let express = require('express');
let router = express.Router();
let dbConnection = require('../../util/db');
const path = require('path');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thesissportmanage@gmail.com',
      pass: 'vtevtgdhgebnyqog'
    }
  });
  
router.post('/verifysingle', (req, res) => {
    let RestoredOTP = req.body.RestoredOTP;
    let otp = req.body.otp;
    let playerFName = req.body.playerFName;
    let playerLName = req.body.playerLName;
    let playerGender = req.body.playerGender;
    let playerBirthday = req.body.playerBirthday;
    let playerPhone = req.body.playerPhone;
    let playerEmail = req.body.playerEmail;
    let facultyID = req.body.facultyID;
    let playerIDCard = req.body.playerIDCard;
    let playerStudentID = req.body.playerStudentID;
    let playerFile1 = req.body.playerFile1;
    let tnmID =req.body.tnmID;


    if (otp === RestoredOTP) {
        dbConnection.query('SELECT * FROM player WHERE playerIDCard = ? AND tnmID = ?',[playerIDCard, tnmID] ,(err,rows) => {
            if(rows.length > 0){
                let form_data = {
                    tnmID: tnmID,
                    playerFName: playerFName,
                    playerLName: playerLName,
                    playerGender: playerGender,
                    playerBirthday: playerBirthday,
                    playerPhone: playerPhone,
                    playerEmail: playerEmail,
                    facultyID: facultyID,
                    playerIDCard: playerIDCard,
                    playerStudentID: playerStudentID,
                    playerFile1: playerFile1,
                    detailDoc: 'สมัครซ้ำ'
                }
                console.log('ซ้ำ')
                dbConnection.query('INSERT INTO player SET ?', form_data, (err, result) => {
                    if (err) {
                        console.log(JSON.stringify(err));
                        req.flash('error', err)
                        res.redirect('/tnmdetail/'+tnmID);
                    } else {
                        req.flash('success', 'สมัครเข้าร่วมการแข่งขันแล้ว');
                        res.redirect('/tnmdetail/'+tnmID);
                    }
                })
            }else{
                let form_data = {
                    tnmID: tnmID,
                    playerFName: playerFName,
                    playerLName: playerLName,
                    playerGender: playerGender,
                    playerBirthday: playerBirthday,
                    playerPhone: playerPhone,
                    playerEmail: playerEmail,
                    facultyID: facultyID,
                    playerIDCard: playerIDCard,
                    playerStudentID: playerStudentID,
                    playerFile1: playerFile1
                }
                console.log('ไม่ซ้ำ')
                dbConnection.query('INSERT INTO player SET ?', form_data, (err, result) => {
                    if (err) {
                        console.log(JSON.stringify(err));
                        req.flash('error', err)
                        res.redirect('/tnmdetail/'+tnmID)
                    } else {
                        req.flash('success', 'สมัครเข้าร่วมการแข่งขันแล้ว');
                        res.redirect('/tnmdetail/'+tnmID);
                    }
                })
            }
        })

    } else {
        res.flash('error','รหัส OTP ไม่ถูกต้อง');
        res.render('userside/regform/otpsingle',{
            playerEmail: playerEmail,
            RestoredOTP: RestoredOTP,
            tnmID: tnmID,
            playerFName: playerFName,
            playerLName: playerLName,
            playerGender: playerGender,
            playerBirthday: playerBirthday,
            playerPhone: playerPhone,
            playerEmail: playerEmail,
            facultyID: facultyID,
            playerIDCard: playerIDCard,
            playerStudentID: playerStudentID,
            playerFile1: name_pfile,
            status_login: req.session.loggedin
        })
        
    }
});

router.post('/verifyteam', (req, res) => {
    let otp = req.body.otp;
    let teamOTP = req.body.teamOTP;
    let teamName = req.body.teamName;
    let NameAgent = req.body.NameAgent;
    let LnameAgent = req.body.LnameAgent;
    let teamPhoneA = req.body.teamPhoneA;
    let teamEmailA = req.body.teamEmailA;
    let teamfile = req.body.teamfile;
    let tnmID = req.body.tnmID;

    let playerFName = req.body.playerFName;
    let playerLName = req.body.playerLName;
    let playerGender = req.body.playerGender;
    let playerBirthday = req.body.playerBirthday;
    let playerPhone = req.body.playerPhone;
    let playerEmail = req.body.playerEmail;
    let facultyID = req.body.facultyID;
    let playerIDCard = req.body.playerIDCard;
    let playerStudentID = req.body.playerStudentID;
    let player_photo = req.body.player_photo;
    let detailDoc = req.body.detailDoc;

    let values = [];

    for (let i = 0; i < playerFName.length; i++) {
    values.push([playerFName[i], playerLName[i], playerGender[i], playerBirthday[i], playerPhone[i],playerEmail[i], facultyID[i], playerIDCard[i], playerStudentID[i], player_photo[i], detailDoc[i], tnmID])
    }


    if(otp === teamOTP){

    let sql_team = "INSERT INTO team (teamName, NameAgent, LnameAgent, teamPhoneA, teamEmailA, teamPic, tnmID) VALUES ?";
    let sql_player = "INSERT INTO player (playerFName, playerLName, playerGender, playerBirthday, playerPhone, playerEmail, facultyID, playerIDCard, playerStudentID, playerFile1, detailDoc, tnmID,teamID) VALUES ?";
        
        // insert query db
        dbConnection.query(sql_team,[[[teamName, NameAgent, LnameAgent, teamPhoneA,teamEmailA, teamfile, tnmID]]], (err, result) => {
            if (err) throw err;
            console.log("Number of teams inserted: " + result.affectedRows);
            let teamID = result.insertId;
            for (let i = 0; i < values.length; i++) {
                values[i].push(teamID)
        }
        dbConnection.query(sql_player, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of persons inserted: " + result.affectedRows);
            req.flash('success', 'สมัครเข้าร่วมการแข่งขันแล้ว');
            res.redirect('/tnmdetail/'+tnmID);
                
        })
        
    })
}else{
    req.flash('error','รหัส OTP ไม่ถูกต้อง');
    res.render('userside/regform/otpteam',{
        teamOTP: teamOTP,
        tnmID: tnmID,
        teamName: teamName,
        NameAgent: NameAgent,
        LnameAgent: LnameAgent,
        teamPhoneA: teamPhoneA,
        teamEmailA: teamEmailA,
        teamfile: teamfile,
        values: values,
        status_login: req.session.loggedin,})
}

})



// display tnmcheck page
router.get('/', (req, res, next) => {
    dbConnection.query('SELECT * FROM tournament ORDER BY tnmID asc', (err, rows) => {
         if (err) {
            req.flash('error', err);
            res.render('userside/index');
        } else {
                res.render('userside/index');
        }
    })
})

router.get('/showall', (req, res, next) => {
    dbConnection.query('SELECT * FROM tournament ORDER BY tnmID asc', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('userside/showall');
        } else {
            res.render('userside/showall');
        }
    })
})

router.get('/tnmdetail/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT * FROM tournament LEFT JOIN sport ON tournament.sportID = sport.sportID WHERE tnmID = ' + tnmID, (err, rows) => {
            res.render('userside/tnm/tnmdetail');
    })
})

router.get('/tnmbracket/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT t.*,s.* FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID WHERE tnmID =' + tnmID, (err, rows) => {
        if(rows[0].sportPlaynum === 1){
            if(rows[0].tnmTypegame ==='leaderboard'){
                dbConnection.query('SELECT p.*,t.tnmID,m.score FROM matchplay m LEFT JOIN player p ON p.playerID = m.playerID LEFT JOIN tournament t ON t.tnmID = m.tnmID WHERE t.tnmID = ? ORDER BY score desc',tnmID, (err, rows) => {
            res.render('userside/tnm/bracket/leaderboard');
                })
            }else if(rows[0].tnmTypegame ==='roundrobin'){
                dbConnection.query(`SELECT p1.playerFName AS team1, p2.playerFName AS team2, m.score1, m.score2 FROM matchplay m LEFT JOIN player p1 ON p1.playerID = m.participant1 LEFT JOIN player p2 ON p2.playerID = m.participant2 WHERE m.tnmID =`+tnmID,(error, rows)=> {
                    res.render('userside/tnm/bracket/roundrobin');
                })
            }else{
                res.render('userside/tnm/blankpage');
            }
        }else{
            if(rows[0].tnmTypegame ==='leaderboard'){
                dbConnection.query('SELECT team.teamName AS playerFName,t.tnmID,m.score FROM matchplay m LEFT JOIN team team ON team.teamID = m.teamID LEFT JOIN tournament t ON t.tnmID = m.tnmID WHERE t.tnmID = ? ORDER BY score desc',tnmID, (err, rows) => {
                    res.render('userside/tnm/bracket/leaderboard');
                        })
            }else if(rows[0].tnmTypegame ==='roundrobin'){

                dbConnection.query(`SELECT t1.teamName AS team1, t2.teamName AS team2, m.score1, m.score2 FROM matchplay m LEFT JOIN team t1 ON t1.teamID = m.participant1 LEFT JOIN team t2 ON t2.teamID = m.participant2 WHERE m.tnmID =`+tnmID,(error, rows)=> {
                    res.render('userside/tnm/bracket/roundrobin');
                })
        }else{
                res.render('userside/tnm/blankpage');
            }

        }
    })
    
})


router.get('/tnmparticipant/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT p.playerID,p.playerFName,p.playerLName,p.playerGender,TIMESTAMPDIFF(YEAR, p.playerBirthday, CURDATE()) AS age,p.playerPhone,p.playerRegDate,p.playerStatus,p.teamID,t.tnmID,t.tnmName,f.name AS FacName FROM player p LEFT JOIN tournament t on p.tnmID = t.tnmID LEFT JOIN faculty f ON f.facultyID = p.facultyID WHERE t.tnmID = ' + tnmID, (err, rows) => {
        if(rows.length){
        if (rows[0].teamID === null){
            res.render('userside/tnm/tnmparticipant');
        } else {
            dbConnection.query('SELECT * FROM team WHERE tnmID = '+tnmID, (err, rows) => {
            res.render('userside/tnm/tnmparticipant');
        })
    }
}
else{
    res.render('userside/tnm/tnmparticipant');
}
})
})

router.get('/tnmmatch/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT * FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID WHERE tnmID =' + tnmID, (err, rows) => {
        if (err) throw err;
        if(rows[0].sportPlaynum === 1){
            if(rows[0].tnmTypegame === 'leaderboard'){
                dbConnection.query('SELECT p.*,t.tnmID,m.score,m.pDate,m.time,pl.placeName FROM matchplay m LEFT JOIN player p ON p.playerID = m.playerID LEFT JOIN tournament t ON t.tnmID = m.tnmID LEFT JOIN place pl ON pl.placeID = m.placeID WHERE t.tnmID = ? ORDER BY score desc',tnmID, (err, rows) => {
            res.render('userside/tnm/match/leadersingle');
                })
            }else if(rows[0].tnmTypegame === 'roundrobin'){
                dbConnection.query("SELECT p1.playerID AS p1ID,p1.playerFName AS player1_name,p2.playerID AS p2ID, p2.playerFName AS player2_name, m.score1, m.score2,m.pDate,m.time,m.timeend,place.placeName FROM matchplay m LEFT JOIN player p1 ON p1.playerID = m.participant1 LEFT JOIN player p2 ON p2.playerID = m.participant2 LEFT JOIN place ON place.placeID = m.placeID WHERE m.tnmID = "+tnmID, (error, rows) => {
                    if(error) throw error;
                    dbConnection.query('SELECT p.placeID,p.placeName FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN sport_type st ON st.typeID = s.typeID LEFT JOIN place p ON p.typeID = st.typeID WHERE tnmID = '+tnmID ,(err,results)=>{
                        if(err) throw err;
                        res.render('userside/tnm/match/roundrobin')
                    })
                })
        }else{
                res.render('userside/tnm/blankpage');
            }
        }else{
            if(rows[0].tnmTypegame === 'leaderboard'){
                dbConnection.query('SELECT team.*,t.tnmID,m.score,m.pDate,m.time,pl.placeName FROM matchplay m LEFT JOIN team team ON team.teamID = m.teamID LEFT JOIN tournament t ON t.tnmID = m.tnmID LEFT JOIN place pl ON pl.placeID = m.placeID WHERE t.tnmID = ? ORDER BY score desc',tnmID, (err, rows) => {
                    res.render('userside/tnm/match/leaderteam');
                    })
            }else if(rows[0].tnmTypegame === 'roundrobin'){
                dbConnection.query("SELECT t1.teamID AS p1ID,t1.teamName AS player1_name,t2.teamID AS p2ID, t2.teamName AS player2_name, m.score1, m.score2,m.pDate,m.time,m.timeend,place.placeName FROM matchplay m LEFT JOIN team t1 ON t1.teamID = m.participant1 LEFT JOIN team t2 ON t2.teamID = m.participant2 LEFT JOIN place ON place.placeID = m.placeID WHERE m.tnmID = "+tnmID, (error, rows) => {
                    if(error) throw error;
                    dbConnection.query('SELECT p.placeID,p.placeName FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN sport_type st ON st.typeID = s.typeID LEFT JOIN place p ON p.typeID = st.typeID WHERE tnmID = '+tnmID ,(err,results)=>{
                        if(err) throw err;
                        res.render('userside/tnm/match/roundrobin')
                    })
                })
        }else{
                res.render('userside/tnm/blankpage');
            }

        }

    })
})

router.get('/tnmrank/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT * FROM tournament WHERE tnmID =' + tnmID, (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('userside/tnm/tnmrank');
        } else {
            res.render('userside/tnm/tnmrank');
        }
    })
})

router.get('/tnmhighlight/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT t.tnmID,t.tnmName,h.tnmID,h.linkvid,h.filePic,h.date,h.description FROM tournament t LEFT JOIN highlight h ON t.tnmID = h.tnmID WHERE t.tnmID = ' + tnmID, (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('userside/tnm/tnmhighlight');
        } else {
            res.render('userside/tnm/tnmhighlight');
        }
    })
})

router.get('/singlereg/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT u.name, u.uniID,t.tnmID, t.tnmName FROM university u INNER JOIN tournament t WHERE tnmID =' +tnmID, (err, rows) => {
                res.render('userside/regform/singlereg');
    })
})

router.post('/singlereg', (req, res, next) =>{

    let playerFName = req.body.playerFName;
    let playerLName = req.body.playerLName;
    let playerGender = req.body.playerGender;
    let playerBirthday = req.body.playerBirthday;
    let playerPhone = req.body.playerPhone;
    let playerEmail = req.body.playerEmail;
    let facultyID = req.body.facultyID;
    let playerIDCard = req.body.playerIDCard;
    let playerStudentID = req.body.playerStudentID;
    let playerFile1 = req.files.playerFile1;
    let tnmID =req.body.tnmID;

    
    var name_pfile = new Date().getTime() +'_'+playerFile1.name;
    playerFile1.mv('./assets/player/' + name_pfile);


    let OTP = Math.floor(1000 + Math.random() * 9000);

    let mailOptions = {
        from: 'thesissportmanagement@gmail.com',
        to: playerEmail,
        subject: 'รหัส OTP สำหรับการยืนยันอีเมลสมัครเข้าร่วมการแข่งขัน',
        text: 'รหัส OTP ของคุณคือ : ' + OTP
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.render('userside/regform/otpsingle',{
            playerEmail: playerEmail,
            status_login: req.session.loggedin,
            OTP: OTP,
            tnmID: tnmID,
            playerFName: playerFName,
            playerLName: playerLName,
            playerGender: playerGender,
            playerBirthday: playerBirthday,
            playerPhone: playerPhone,
            playerEmail: playerEmail,
            facultyID: facultyID,
            playerIDCard: playerIDCard,
            playerStudentID: playerStudentID,
            playerFile1: name_pfile})
        }
      });
})

router.get('/teamreg/(:tnmID)', (req, res, next) => {
    let tnmID = req.params.tnmID;
    dbConnection.query('SELECT u.name, u.uniID,t.tnmID, t.tnmName,s.sportName,s.sportPlaynum FROM tournament t INNER JOIN university u LEFT JOIN sport s ON t.sportID = s.sportID WHERE tnmID = ' +tnmID, (err, rows) => {
                res.render('userside/regform/teamreg');
    })
})

router.post('/teamreg', async (req, res, next) =>{
    //ทีม
    let teamName = req.body.teamName;
    let NameAgent = req.body.NameAgent;
    let LnameAgent = req.body.LnameAgent;
    let teamPhoneA = req.body.teamPhoneA;
    let teamEmailA = req.body.teamEmailA;
    let teamPic = req.files.teamPic;
    let tnmID = req.body.tnmID[0];
    var teamfile = new Date().getTime() +'_'+teamPic.name;
    teamPic.mv('./assets/team/' + teamfile);

    //ผู้เล่น
    let playerFName = req.body.playerFName;
    let playerLName = req.body.playerLName;
    let playerGender = req.body.playerGender;
    let playerBirthday = req.body.playerBirthday;
    let playerPhone = req.body.playerPhone;
    let playerEmail = req.body.playerEmail;
    let facultyID = req.body.facultyID;
    let playerIDCard = req.body.playerIDCard;
    let playerStudentID = req.body.playerStudentID;
    
    let values = [];

    let playerFile1 = req.files.playerFile1;

    

    for (let i = 0; i < playerFName.length; i++) {
        let player_photo = null;
        if(playerFile1[i]){
            let name_pfile = new Date().getTime() +'_'+playerFile1[i].name;
            playerFile1[i].mv('./assets/player/' + name_pfile);
            player_photo = name_pfile;
        }
    
        try{
        
    let rows = await dbConnection.query('SELECT * FROM player WHERE playerIDCard = ? AND tnmID = ?', [playerIDCard[i], tnmID], (err, rows) => {
            if(err) reject(err)
        console.log(rows);
        if(rows.length > 0){
            let  detailDoc = 'สมัครซ้ำ';
            values.push([playerFName[i], playerLName[i], playerGender[i], playerBirthday[i], playerPhone[i],playerEmail[i], facultyID[i], playerIDCard[i], playerStudentID[i], player_photo, detailDoc, tnmID])
            console.log('ซ้ำ',values);
        }else{
            let detailDoc = null;
            values.push([playerFName[i], playerLName[i], playerGender[i], playerBirthday[i], playerPhone[i],playerEmail[i], facultyID[i], playerIDCard[i], playerStudentID[i], player_photo, detailDoc, tnmID])
       console.log('ไม่ซ้ำ',values);
        }
    });
  } catch (err) {
    console.log(err);
    return;
  }
}


        let teamOTP = Math.floor(1000 + Math.random() * 9000);

        let mailOptions = {
            from: 'thesissportmanagement@gmail.com',
            to: teamEmailA,
            subject: 'รหัส OTP สำหรับการยืนยันอีเมลสมัครเข้าร่วมการแข่งขัน',
            text: 'รหัส OTP ของคุณคือ : ' + teamOTP
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.render('userside/regform/otpteam',{
                status_login: req.session.loggedin,
                teamOTP: teamOTP,
                tnmID: tnmID,
                values: values,
                teamName: teamName,
                NameAgent: NameAgent,
                LnameAgent: LnameAgent,
                teamPhoneA: teamPhoneA,
                teamEmailA: teamEmailA,
                teamfile: teamfile
                })
            }
          });

})


router.post("/fetch_faculty", function(req, res) {
    var uniID = req.body.uniID;
    var fac_query = "SELECT * FROM faculty WHERE uniID = ?";
    dbConnection.query(fac_query, [uniID], function(err, results) {
        if (err) throw err;
        res.send(results);
    });
});

router.get('/result',(req,res,next)=>{
 dbConnection.query('SELECT * FROM university',(error,results)=>{
    res.render('userside/result')
 })
})

router.get('/result/(:uniID)',(req,res,next)=>{
    let uniID = req.params.uniID;
    dbConnection.query('SELECT * FROM university WHERE uniID = '+uniID,(error,results)=>{
       res.render('userside/uniresult')
    })
   })

   router.get('/opening',(req,res,next)=>{
    dbConnection.query('SELECT t.*,s.*,count(p.playerFName) AS nop FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN player p ON t.tnmID = p.tnmID WHERE t.Rstartdate >= CURRENT_DATE() OR t.Renddate <= CURRENT_DATE() GROUP BY t.tnmID;',(error,results)=>{
       res.render('userside/status/opening')
    })
   })

   router.get('/ongoing',(req,res,next)=>{
    dbConnection.query('SELECT t.*,s.*,count(p.playerFName) AS nop FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN player p ON t.tnmID = p.tnmID WHERE t.tnmStartdate >= CURRENT_DATE() OR t.tnmEnddate <= CURRENT_DATE() GROUP BY t.tnmID;',(error,results)=>{
       res.render('userside/status/ongoing')
    })
   })

   router.get('/ending',(req,res,next)=>{
    dbConnection.query('SELECT * FROM tournament WHERE st1 IS NOT NULL',(error,results)=>{
       res.render('userside/status/ending')
    })
   })

   router.get('/search',(req,res,next)=>{
    dbConnection.query('SELECT t.*,s.*,count(p.playerFName) AS nop FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN player p ON t.tnmID = p.tnmID GROUP BY t.tnmID;',(error,results)=>{
       res.render('userside/status/search')
    })
   })

   router.post('/search-result',(req,res,next)=>{
    let query = req.body.search;
    let sport = req.body.sport;
    let status = req.body.status;

    if(!query && !sport && !status){
        res.redirect('/search');
    }
    
    let sql;
    let like;
    
     if(query){
     sql = "SELECT t.*,s.*,count(p.playerFName) AS nop FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN player p ON t.tnmID = p.tnmID WHERE t.tnmName LIKE ? GROUP BY t.tnmID;";
     like = ['%' + query + '%'];
    dbConnection.query(sql, like, (err, results) => {
        if(err) throw err;
        res.render('userside/status/search');
    });
    }else if(sport){ 
     sql = "SELECT t.*,s.*,count(p.playerFName) AS nop FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN player p ON t.tnmID = p.tnmID WHERE s.sportID LIKE ? GROUP BY t.tnmID;";
     like = ['%' + sport + '%'];
        dbConnection.query(sql, like, (err, results) => {
            if(err) throw err;
            res.render('userside/status/search');
        });
    }else if(status) {
        if(status === 'opening'){
    sql = "SELECT t.*,s.*,count(p.playerFName) AS nop FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN player p ON t.tnmID = p.tnmID WHERE t.Rstartdate >= CURRENT_DATE() OR t.Renddate <= CURRENT_DATE() GROUP BY t.tnmID;";
    like = [status];
    dbConnection.query(sql, like, (err, results) => {
        if(err) throw err;
        res.render('userside/status/search');
    });
        }else if(status === 'ongoing'){
            sql = "SELECT t.*,s.*,count(p.playerFName) AS nop FROM tournament t LEFT JOIN sport s ON s.sportID = t.sportID LEFT JOIN player p ON t.tnmID = p.tnmID WHERE t.tnmStartdate >= CURRENT_DATE() OR t.tnmEnddate <= CURRENT_DATE() GROUP BY t.tnmID;";
            like = [status];
            dbConnection.query(sql, like, (err, results) => {
                if(err) throw err;
                res.render('userside/status/search');
            });
        }else if(status === 'ending'){
            sql = "SELECT * FROM tournament WHERE st1 IS NOT NULL";
            dbConnection.query(sql,(err, results) => {
                if(err) throw err;
                res.render('userside/status/search');
            });
        }
  }

   })

module.exports = router;