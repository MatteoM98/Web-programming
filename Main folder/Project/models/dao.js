"use strict;"

const db = require('../db.js');
const bcrypt = require('bcrypt'); 
const js = require('../public/javascripts/username.js');
const { relativeTimeRounding } = require('moment');


exports.getAllPodcast = function() {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * from podcast';
        db.all(sql,(err,rows)=>{
            if(err) {
                reject(err);
                return;
            }

            resolve(rows);
        })
    })
}

exports.getPodcastByID = function(param) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from podcast WHERE ID=?';
        db.get(sql,[param],(err,row) => {
            if(err) {
                reject (err);
                return;
            }
            if(row === undefined) {
                resolve({error: 'Podcast not found'});
            }else {
                const podcast = {id: row.ID, title: row.Title,
                    des: row.Description, cat: row.Category,
                    img: row.Image, author: row.Author};
                resolve(podcast);
            }
        });
    });
}

exports.createNewPodcast = function(param) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO podcast(Title, Description, Category, Image, Author) VALUES (?,?,?,?,?)';
        const title = param.Title;
        const des = param.Description;
        const cat = param.Category;
        const img = param.Image;
        const author = param.Author;

        db.run(sql,[title,des,cat,img,author],function (err) {
            if(err) {
               reject ();
               return;
            }
            resolve();   
       });
    });
}

//another version
exports.createNewPodcastWithParam = function(title,des,cat,img,author) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO podcast(Title, Description, Category, Image, Author) VALUES (?,?,?,?,?)';
        db.run(sql,[title,des,cat,img,author],function (err) {
            if(err) {
               reject (err);
               return;
            }
            resolve(this.lastID);   
       });
    });
}


exports.deletePodcast = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM podcast WHERE id = ?';
        db.run(sql, [id], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0)
                reject({error: 'Podcast not found.'});
            else {
                updateEpisode(id)
                updateIsPartOf(id);
                resolve();
            }
        });
    });
}

function updateIsPartOf(podcastID) {
    const sql = 'DELETE FROM isPartOf WHERE PodcastID = ?';
    db.run(sql, [podcastID],null);
}

function updateEpisode(podcastID) {
    const sql = 'DELETE FROM Episode \
                 WHERE ID = ( \
                 SELECT EpisodeID \
                 FROM IsPartOf \
                 WHERE PodcastID = ?)';
    db.run(sql, [podcastID],null);
}


exports.alterPodcast = function (param,id) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE podcast SET Title=?, Description=?, Category=?, Image=?, Author=? WHERE id=?';
        const title = param.Title;
        const des = param.Description;
        const cat = param.Category;
        const img = param.Image;
        const author = param.Author;

        db.run(sql,[title,des,cat,img,author,id],function (err) {
            if(err) {
                reject ();
                return;
             }
             resolve();   
        });
    });
}


exports.getUser = function (email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User WHERE Email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
              const user = {id: row.Username, username: row.Email};
              let check = false;
              if(bcrypt.compareSync(password, row.Password)) {
                check = true;
              }
              resolve({user, check});
            }
        });
    });
}

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User WHERE Username = ?';
        db.get(sql, [id], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
                const user = {id: row.Username, email : row.Email, type : row.Type, password : row.Password}
                resolve(user);
            }
        });
    });
  };


  exports.createUser = function (email, password) {
    return new Promise((resolve, reject) => {
     //create a random username
      const username = js.randName(js.nameList);
      const sql = 'INSERT INTO User(Username, Email, Password) VALUES (?,?,?)';
      // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
      bcrypt.hash(password, 10).then((hash => {
        db.run(sql, [username, email, hash], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(username);
          }
        });
      }));
    });
  }

  exports.getPodcastsByUser = function (username) {
      return new Promise((resolve, reject) => {
          const sql = 'SELECT ID,Title,Description,Category,Image FROM Podcast AS p JOIN Follow AS f on f.PodcastID = p.ID WHERE f.Username = ?'
          db.all(sql,[username],(err,rows) => {
              if(err) {
                  reject(err);
              } else {
                  resolve(rows);
              }

          });
      });
  }

  exports.getEpisodeByPodcast = function (podcastID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Title,Description,Date,Audio,Price,Sponsor from Episode as e JOIN isPartOf as i ON i.EpisodeID = e.ID WHERE PodcastID=?'
        db.all(sql,[podcastID],(err,rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


exports.getEpisodeAndPodcastFromUser = function (username) {
    return new Promise((resolve, reject) => {
        const sql1 = 'select ID,Title,Type,Image from (SELECT * FROM Podcast AS p JOIN Follow AS f on f.PodcastID = p.ID WHERE f.Username = ?) as p join User as u on u.Username = p.Username;'
        let array = [];
        let obj;
        db.all(sql1,[username],(err,rows) => {
            if(err) {
                reject(err);
            } else if (rows.length != 0) {
                const sql2 = 'SELECT *  \
                              FROM Episode as e \
                              JOIN isPartOf as i ON i.EpisodeID = e.ID \
                              WHERE PodcastID=?  AND Price = 0 \
                              UNION \
                              SELECT * \
                              FROM ( SELECT * \
                                     FROM Episode AS e \
                                     JOIN isPartOf AS i ON i.EpisodeID = e.ID \
                                     WHERE PodcastID=?  AND Price > 0) \
                               AS p \
                               WHERE ID IN ( SELECT EpisodeID \
                                             FROM Purchased \
                                             WHERE Username =?) \
                               ORDER BY Date';

                for(let i=0; i < rows.length ; i++) {
                    db.all(sql2, [rows[i].ID,rows[i].ID,username], (err, episodes) => {
                        if(err) {
                            reject(err);
                        }else {
                            let episodes_obj = new Object(episodes)
                            obj = new Object({'titlePod': rows[i].Title, 'episodes': episodes_obj, 'imagePod' : rows[i].Image}); //Title
                            array.push(obj);
                        }
                        if(i===rows.length-1) {
                            let res = new Object({'array': array, 'username': username, 'type': rows[i].Type , 'length' :rows.length }); //Type //Length
                            resolve(res);
                        }
                    });
                }
            } else {
                const sql = 'SELECT Type from User WHERE Username=?';
                db.get(sql,[username], (err,rows) => {
                    if(err) {
                        reject(err);
                        return;
                    } else {
                        let obj = new Object({'array': null, 'username': username, 'type': rows.Type , 'length' : 0 }); //Type //Length
                        resolve (obj);
                    }
                })
            }
        });
    });
}


exports.createNewCC = function (number,owner,type,ccv,expireDate,name,surname) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO CreditCard(Number, Owner, Type, CCV, ExpireDate, Name, Surname) VALUES (?,?,?,?,?,?,?)';
        db.run(sql,[number,owner,type,ccv,expireDate,name,surname],function (err,row) {
            if(err) {
                reject (err);
                return;
            }
            resolve(row);   
        });
    });
}

exports.getCCByUser = function (username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Number,Type,CCV,ExpireDate,Name,Surname from CreditCard WHERE Owner=?';
        db.get(sql,[username],function (err,row) {
            if(err) {
                reject (err);
                return;
            }
            resolve(row);   
        });
    });
}

exports.getFavouriteEpisodes = function (username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT p.ID,p.Title as Title, p.Description as Description,Date,Audio,Price,Sponsor,Image,pod.Title as PodcastTitle \
                     FROM Podcast as pod \
                     JOIN IsPartOf as i on pod.ID = i.PodcastID \
                     JOIN \
                        (SELECT E.ID as ID,Title,Description,Date,Audio,Price,Sponsor  \
                         FROM Episode as E \
                         JOIN Favorites as F  \
                         ON E.ID = F.EpisodeID \
                         WHERE F.Username = ?) \
                     as p ON p.ID = i.EpisodeID'; 

        db.all(sql,[username], function (err,rows) {
            if(err) {
                reject (err);
                return;
            }
            resolve(rows);
        });
    });
}

exports.addEpisodesToPodcast = function (episodesID, podcastID) {
    return new Promise((resolve, reject) => {
        for (let id of episodesID) {
            if(id === '-') continue;
            const sql = 'INSERT INTO IsPartOf (EpisodeID, PodcastID) VALUES (?,?)';
            db.run(sql,[id,podcastID],function (err,row) {
                if(err) {
                    reject (err);
                    return;
                }
            });
        }
        resolve(); 
    });
}

exports.addOneEpisodeToPodcast = function (episodeID, podcastID) {
    return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO IsPartOf (EpisodeID, PodcastID) VALUES (?,?)';
            db.run(sql,[episodeID,podcastID],function (err,row) {
                if(err) {
                    reject (err);
                    return;
                }
            });
        resolve(); 
    });
}

exports.getFreeEpisodes = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT ID,Title \
                     FROM Episode \
                     WHERE ID NOT IN ( \
                        SELECT EpisodeID \
                        FROM IsPartOf \
                     )';
        db.all(sql,[],function (err,rows) {
            if(err) {
                reject (err);
                return;
            }
            resolve(rows);
        });
    });      
}

exports.createNewEpisode = function (title,description,date,audio,price,sponsor,author) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Episode(Title, Description, Date, Audio, Price, Sponsor, Author) VALUES (?,?,?,?,?,?,?)';
        db.run(sql,[title,description,date,audio,price,sponsor,author],function (err,row) {
            if(err) {
                reject (err);
                return;
            }
            resolve(this.lastID);   
        });
    });
}

exports.getPodcastCreatedBy = function(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from podcast WHERE Author=?';
        db.all(sql,[username],(err,rows) => {
            if(err) {
                reject (err);
                return;
            } else {
                resolve(rows);
            }
        });
    });
}

exports.modifyPodcast = function (id,title,des,cat) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Podcast \
                     SET Title = ?, \
                     Description = ?, \
                     Category = ? \
                     WHERE ID = ? ';

        db.run(sql,[title,des,cat,id],function (err,row) {
            if(err) {
                reject (err);
                return;
            }
            resolve();   
        });
    });
}

exports.getEpisodesByAuthor = function (username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT e.ID,e.Title, e.Description, Date, Audio, Price, Sponsor, p.Title as Podcast \
                     FROM Episode as e \
                     JOIN isPartOf as i on e.ID = i.EpisodeID \
                     LEFT JOIN Podcast as p on i.PodcastID = p.ID \
                     WHERE e.Author = ? \
                     ORDER BY Podcast NULLS LAST,Date';

        db.all(sql,[username],(err,rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

exports.deleteEpisode = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Episode WHERE ID = ?';
        db.run(sql,[id],(err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


exports.modifyEpisode = function (id,Title, Description, Date, Price, Sponsor = null) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Episode SET Title = ?, Description = ?, Date = ?, Price = ?, Sponsor = ? WHERE ID = ?';
        
        db.run(sql,[Title,Description,Date,Price,Sponsor,id],(err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.modifyIsPartOf = function (episodeID, podcastID) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE IsPartOf \
                     SET EpisodeID = ?, \
                         PodcastID = ? \
                     WHERE EpisodeID = ?';

        db.run(sql,[episodeID,podcastID,episodeID],(err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


exports.unfollowPodcast = function (username, podID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Follow WHERE Username = ? AND PodcastID = ?';
        db.run(sql,[username,podID],(err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


exports.removeEpisodeFromFavorites = function (username, episodeID) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Favorites WHERE Username = ? AND EpisodeID = ?';
        db.run(sql,[username,episodeID],(err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.getPodcastFilteredByParam = function (param) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * \
                     FROM Podcast \
                     WHERE instr(Description, ?) OR instr(Title, ?)";

        db.all(sql,[param,param],(err,rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


exports.getEpisodesFilteredByParam = function (param) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * \
                     FROM Episode \
                     WHERE instr(Description, ?) OR instr(Title, ?)";

        db.all(sql,[param, param],(err,rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

exports.getPodcastFilteredByCategoryAndParam = function (category, param) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * \
                     FROM Podcast \
                     WHERE (instr(Description, ?) OR instr(Title, ?)) AND Category = ?';

        db.all(sql,[param,param,category],(err,rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


exports.getAllEpisodes = function() {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * from Episode';
        db.all(sql,(err,rows)=>{
            if(err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

exports.followPodcast =  function(username, podcastID) {
    return new Promise((resolve,reject) => {
        const sql = 'INSERT INTO Follow VALUES (?,?)';
        db.run(sql,[username,podcastID],(err,rows)=> {
            if(err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

exports.hasUserCC = function(username) {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * \
                     FROM CreditCard \
                     WHERE Owner = ?';

        db.get(sql,[username],(err,rows)=> {
            if(err) {
                reject(err);
                return;
            } 
            resolve(rows);
        })
    })
}

exports.addPurchasedEpisode = function(username, episodeID) {
    return new Promise((resolve,reject) => {
        const sql = 'INSERT INTO Purchased VALUES (?,?)';

        db.run(sql,[username,episodeID],(err)=> {
            if(err) {
                reject(err);
                return;
            } 
            resolve();
        })
    })
}

exports.addEpisodeToFavorites = function(username, episodeID) {
    return new Promise((resolve,reject) => {
        const sql = 'INSERT INTO Favorites VALUES (?,?)';

        db.run(sql,[username,episodeID],(err)=> {
            if(err) {
                reject(err);
                return;
            } 
            resolve();
        })
    })
}

exports.getPodcastFilteredByCategory = function(category) {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * from Podcast WHERE Category = ?';
        db.all(sql,[category],(err,rows)=>{
            if(err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}


exports.getEpisodeFilteredByCategory = function(category) {
    return new Promise((resolve,reject) => {
        const sql = 'Select e.ID,e.Title,e.Description,e.Date,e.Audio,e.Price,e.Sponsor,e.Author,Category \
                     FROM Episode as e \
                     JOIN IsPartOf as i \
                     JOIN Podcast as p \
                     ON e.ID = i.EpisodeID AND p.ID = i.PodcastID \
                     WHERE Category = ?';

        db.all(sql,[category],(err,rows)=>{
            if(err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}


exports.getEpisodeInfo = function(id) {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT e.ID,e.Title, e.Description, e.Date, e.Audio, e.Price, \
                     e.Sponsor, e.Author, p.Title as Podcast, p.Image as PodcastImage \
                     FROM Episode AS e \
                     JOIN IsPartOf AS i ON i.EpisodeID = e.ID \
                     JOIN Podcast AS p ON i.PodcastID = p.ID \
                     WHERE e.ID = ?';

        db.get(sql,[id],(err,row)=>{
            if(err) {
                reject(err);
                return;
            }
            resolve(row);
        })
    })
}


exports.getCommentsOfEpisode = function(episodeID) {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * \
                     FROM Comment \
                     WHERE EpisodeID = ?';

        db.all(sql,[episodeID],(err,rows)=>{
            if(err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}


exports.createNewComment = function(username, episodeID, comment) {
    return new Promise((resolve,reject) => {
        const sql = 'INSERT INTO Comment (Username,EpisodeID,Message) VALUES (?,?,?)';

        db.run(sql,[username,episodeID,comment],(err)=> {
            if(err) {
                reject(err);
                return;
            } 
            resolve();
        })
    })
}


exports.deleteComment = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Comment WHERE ID = ?';
        db.run(sql,[id],(err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.modifyComment = function (id, message) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Comment \
                     SET Message = ? \
                     WHERE ID = ?';

        db.run(sql,[message,id],(err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
