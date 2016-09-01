using KindleSpur.Models.Interfaces;
using KindleSpur.Models;
using KindleSpur.Models.Interfaces.Repository;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
using System.Collections;
using System.Diagnostics;

namespace KindleSpur.Data
{
    public class UserRepository : IUserRepository
    {
        private Connection con = new Connection();
        private MongoCollection _logCollection;
        private MongoCollection _userCollection;
        private string emailAddress;
        MongoCollection _coacheeOrMenteeCollection;
        MongoCollection _coachOrMentorCollection;


        public UserRepository()
        {
            try
            {
                _logCollection = con.GetCollection("ErrorLogs");
                _userCollection = con.GetCollection("UserDetails");
            }
            catch (MongoException ex)
            {
                _logCollection.Insert("{ Error : 'Database connection failed.', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ");
            }
        }

        public UserRepository(string emailAddress) : this()
        {
            this.emailAddress = emailAddress;
        }

        public bool AddNewUser(IUser userData)
        {
            bool _transactionStatus = false;

            try
            {
                var result = _userCollection.FindAs<IUser>(Query.EQ("EmailAddress", userData.EmailAddress));

                if (result.Count() > 0)
                    return false;

                userData.UpdateDate = DateTime.Now;
                userData.IsVerified = true;
                _userCollection.Insert(userData);

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at AddNewUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at AddNewUser()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return _transactionStatus;

        }

        public bool EditUser(string userId, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<IUser>(Query.EQ("_id", ObjectId.Parse(userId)));
                userDetail.EmailAddress = userData.EmailAddress;
                userDetail.Password = userData.Password;
                userDetail.IsExternalAuthentication = userData.IsExternalAuthentication;
                userDetail.UpdateDate = DateTime.Now;
                userDetail.IsVerified = true;

                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at EditUser().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at EditUser()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public User SavePassword(string userId, IUser userData)
        {
            User userDetail = _userCollection.FindOneAs<User>(Query.EQ("_id", ObjectId.Parse(userId)));
            userDetail.Password = userData.Password;
            userDetail.IsExternalAuthentication = userData.IsExternalAuthentication;
            userDetail.UpdateDate = DateTime.Now;
            userDetail.IsVerified = true;
            _userCollection.Save(userDetail);
            MongoCursor<User> result = _userCollection.FindAs<User>(Query.EQ("invitation.Invites", userDetail.EmailAddress));
            List<User> list = result.ToList();
            for (int userListCount = 0; userListCount < list.Count; userListCount++)
            {
                string emailAddress = list[userListCount].EmailAddress;
                User user = (User)GetUserDetail(emailAddress);
                user.InviteRewardPoints += 2;
                user.TotalRewardPoints += 2;
                _userCollection.Save(user);
            }
            return (User)userDetail;
        }

        public IUser GetUserDetail(int userId)
        {
            try
            {
                return _userCollection.FindOneByIdAs<IUser>(userId);
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetUserDetail().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetUserDetail()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
        }
        public IUser GetUserDetail(string EmailAddress)
        {
            try
            {
                return _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetUserDetail().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetUserDetail()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
        }

        //This method to be tested after AngularJS code written
        public List<List<IFeedback>> GetFeedback(string emaiAddress)
        {          
            CoacheeOrMentee menteeEntity = new CoacheeOrMentee();
            CoacheeOrMentee coacheeEntity = new CoacheeOrMentee();
            CoachOrMentor mentorEntity = new CoachOrMentor();
            CoachOrMentor coachEntity = new CoachOrMentor();
            List<List<IFeedback>> entireFeedback = new List<List<IFeedback>>();
            try
            {
                coacheeEntity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", emailAddress), Query.EQ("Role", "Coachee")));
                menteeEntity = _coacheeOrMenteeCollection.FindOneAs<CoacheeOrMentee>(Query.And(Query.EQ("UserId", emailAddress), Query.EQ("Role", "Mentee")));
                coachEntity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", emailAddress), Query.EQ("Role", "Coach")));
                mentorEntity = _coachOrMentorCollection.FindOneAs<CoachOrMentor>(Query.And(Query.EQ("UserId", emailAddress), Query.EQ("Role", "Mentor")));

                entireFeedback.Add(coacheeEntity.Feedbacks);
                entireFeedback.Add(menteeEntity.Feedbacks);
                entireFeedback.Add(mentorEntity.Feedbacks);
                entireFeedback.Add(coachEntity.Feedbacks);
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at addFeedback().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
                //_transactionStatus = false;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at addFeedback()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                //  throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return entireFeedback;
        }

        public bool UpdateUserDetails(string EmailAddress, IUser userData)
        {
            bool _transactionStatus = false;
            try
            {
                //var userDetail = _userCollection.FindOneByIdAs<User>(userId);
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.FirstName = userData.FirstName;
                userDetail.EmailAddress = EmailAddress;
                userDetail.LastName = userData.LastName;
                userDetail.Mobile = userData.Mobile;
                userDetail.Country = userData.Country;
                userDetail.City = userData.City;
                userDetail.State = userData.State;
                userDetail.LinkdinURL = userData.LinkdinURL;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdateUserDetails()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public bool UpdatePassword(string emailAddress, string password)
        {
            bool _transactionStatus = false;
            try
            {
                //var userDetail = _userCollection.FindOneByIdAs<User>(userId);
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", emailAddress));
                userDetail.Password = password;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserDetails().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdateUserDetails()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public bool UpdateUserDesc(string EmailAddress, string description)
        {
            bool _transactionStatus = false;
            try
            {
                //var userDetail = _userCollection.FindOneByIdAs<IUser>(EmailAddress);
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.description = description;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserDesc().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdateUserDesc()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public bool UpdateUserPhoto(string EmailAddress, string PhotoPath)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.Photo = PhotoPath;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserPhoto().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdateUserPhoto()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public bool SaveInviteEmailAddresses(User userData, Invitation invitation)
        {
            bool _transactionStatus = false;

            try
            {
                User userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", userData.EmailAddress));
                List<Invitation> listOfInvitation = new List<Invitation>();
                Invitation invite = new Invitation();
                List<string> inviteEmailAddress = new List<string>();

                string oneInviteEmailAddress;
                for (int countOfInvites = 0; countOfInvites < invitation.Invites.Count; countOfInvites++)
                {
                    oneInviteEmailAddress = invitation.Invites[countOfInvites];
                    inviteEmailAddress.Add(oneInviteEmailAddress);
                    //invite.Invites.Add(oneInviteEmailAddress);
                }
                invite.Invites = inviteEmailAddress;
                invite.Description = invitation.Description;
                listOfInvitation.Add(invite);
                if (userData.invitation != null)
                {
                    for (int i = 0; i < userData.invitation.Count; i++)
                    {
                        invite = userData.invitation[i];
                        listOfInvitation.Add(invite);
                    }

                }



                userDetail.invitation = listOfInvitation;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed while Inviting Others().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Unfortunaltely you couldnt Invite others to KindleSpur!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed while Inviting Others()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Unfortunaltely you couldnt Invite others to KindleSpur!!!");
            }
            finally
            {

            }

            return _transactionStatus;

        }

        public bool UpdatecoverPhoto(string EmailAddress, string coverPhotoPath)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                userDetail.coverphoto = coverPhotoPath;
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdatecoverPhoto().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at UpdatecoverPhoto()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }


        public void GetRewardPoints(string EmailAddress, ref Reward reward)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));
                reward.TotalRewardPoints = (userDetail.TotalRewardPoints.ToString() != null ? userDetail.TotalRewardPoints : 0);
                reward.BalanceRewardPoints = (userDetail.BalanceRewardPoints.ToString() != null ? userDetail.BalanceRewardPoints : 0);
                reward.RedeemedPoints = (userDetail.RedeemedPoints.ToString() != null ? userDetail.RedeemedPoints : 0);
                reward.InviteRewardPoints = (userDetail.InviteRewardPoints.ToString() != null ? userDetail.InviteRewardPoints : 0);

                if (reward.PSRAndGames == null) reward.PSRAndGames = new List<ActiveGamesAndPSR>();

                if (userDetail.Games != null)
                {
                    for (int index = userDetail.Games.Count - 1; index >= 0; index--)
                    {
                        ActiveGamesAndPSR objGamesAndPSR = new ActiveGamesAndPSR();
                        if (!userDetail.Games[index].Name.Contains("PSR"))
                        {
                            objGamesAndPSR.Name = "Game " + (index + 1);
                            objGamesAndPSR.PSR = false;
                        }
                        else
                        {
                            objGamesAndPSR.Name = userDetail.Games[index].Name;
                            objGamesAndPSR.PSR = true;
                        }


                        objGamesAndPSR.Key = userDetail.Games[index].Key;
                        objGamesAndPSR.date = userDetail.Games[index].UnlockedDate.ToShortDateString();


                        reward.PSRAndGames.Add(objGamesAndPSR);
                    }
                }
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {

                string message = "{ Error : 'Failed at GetRewardPoints().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetRewardPoints()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
        }

        public string GamesUnLocked(ObjectId userId)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneByIdAs<User>(userId);

                Game _game = UnlockGames(userDetail.TotalRewardPoints, userDetail.BalanceRewardPoints);
                if (_game != null)
                {
                    if (userDetail.Games == null) userDetail.Games = new List<Game>();

                    if (!userDetail.Games.Any(x => x.Key == _game.Key))
                    {
                        _game.UnlockedDate = DateTime.Now;
                        userDetail.Games.Add(_game);
                        userDetail.BalanceRewardPoints -= (int.Parse(_game.GameId) * 10);
                        userDetail.RedeemedPoints += (int.Parse(_game.GameId) * 10);
                        _userCollection.Save(userDetail);
                    }
                    _transactionStatus = true;
                    return _game.Key;
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GamesUnLocked().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GamesUnLocked()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }

            return "";
        }

        public string PSRUnLocked(ObjectId userId)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneByIdAs<User>(userId);

                Boolean _psr = UnlockPSR(userDetail.TotalRewardPoints, userDetail.BalanceRewardPoints);
                if (_psr)
                {
                    if (userDetail.Games == null) userDetail.Games = new List<Game>();

                    int count = userDetail.Games.Select(x => x.Name.Contains("PSR")).Count() + 1;

                    Game _game = new Game();
                    _game.Id = new ObjectId();
                    _game.Name = "PSR" + count;
                    _game.Key = "";

                    _game.UnlockedDate = DateTime.Now;

                    userDetail.Games.Add(_game);
                    userDetail.BalanceRewardPoints -= 10;
                    userDetail.RedeemedPoints += 10;
                    _userCollection.Save(userDetail);

                    _transactionStatus = true;
                    return _game.Key;
                }
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at PSRUnLocked().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GamesUnLocked()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return "";
        }

        private Game UnlockGames(int RewardPointsGained, int BalancePoints)
        {
            var _gamesCollection = con.GetCollection("BrainGames");

            if (RewardPointsGained < 10 || BalancePoints < 10)
            {
                return null;
            }

            // RewardPointsGained = (RewardPointsGained - (RewardPointsGained % 10))/10;
            string Id = (BalancePoints / 10).ToString();
            return _gamesCollection.FindOneAs<Game>(Query.EQ("GameId", Id));
        }

        private Boolean UnlockPSR(int RewardPointsGained, int BalancePoints)
        {

            if (RewardPointsGained < 10 || BalancePoints < 10)
            {
                // throw new Exception("You do not have sufficient points to unlock games!!!");
                return false;
            }

            return true;
        }

        public Boolean RemoveVCSCActivity(string EmailAddress, VSCS _vscs)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));

                userDetail.ValueCreationActivity.RemoveAll(x => x.VSCSId == _vscs.VSCSId);

                _userCollection.Save(userDetail);

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at RemoveVCSCActivity().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
                _transactionStatus = false;
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at RemoveVCSCActivity()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {


            }
            return _transactionStatus;
        }

        public Boolean SaveVCSCActivity(string EmailAddress, VSCS _vscs)
        {
            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));

                if (userDetail.ValueCreationActivity == null)
                {
                    userDetail.ValueCreationActivity = new List<VSCS>();
                    userDetail.ValueCreationActivity.Add(_vscs);
                }
                else
                {
                    VSCS _entity = userDetail.ValueCreationActivity.Where(x => x.VSCSId == _vscs.VSCSId).SingleOrDefault();
                    if (_entity == null)
                        userDetail.ValueCreationActivity.Add(_vscs);
                    else
                    {
                        _entity.eventTitle = _vscs.eventTitle;
                        for (int i = _entity.Tasks.Count - 1; i >= 0; i--)
                        {
                            bool blnDelete = true;

                            foreach (Tasks item in _vscs.Tasks)
                            {
                                if (item.eventTitle == _entity.Tasks[i].eventTitle)
                                {

                                    blnDelete = false;
                                    break;
                                }
                            }

                            if (blnDelete) _entity.Tasks.RemoveAt(i);
                        }

                        foreach (Tasks item in _vscs.Tasks)
                        {
                            bool blnAdd = true;
                            for (int i = _entity.Tasks.Count - 1; i >= 0; i--)
                            {
                                if (_entity.Tasks[i].eventTitle == item.eventTitle)
                                {
                                    blnAdd = false;
                                    break;
                                }
                            }

                            if (blnAdd) _entity.Tasks.Add(item);
                        }
                    }

                }
                _userCollection.Save(userDetail);
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at SaveVCSCActivity().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at SaveVCSCActivity()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        private int CalculateScore(int type, int measure)
        {
            return (1 * type * measure);
        }

        public bool SaveValueFeedStory(ValueFeedStory story)
        {
            var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", emailAddress));
            try
            {
                story.CreateDate = DateTime.Now;
                story.UserId = emailAddress;
                if (userDetail.ValueFeedStories == null) userDetail.ValueFeedStories = new List<ValueFeedStory>();
                userDetail.ValueFeedStories.Add(story);
                _userCollection.Save(userDetail);

                return true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at SaveValueFeedStory().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at SaveValueFeedStory()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {


            }
        }

        public List<ValueFeedStory> GetValueFeedStories(string ImpactZone)
        {
            //var matchMember = new BsonDocument { { "$match", new BsonDocument { { "ValueFeedStories.ImpactZone", ImpactZone } } } };
            //var unwindStories = new BsonDocument { { "$unwind", "$ValueFeedStories" } };
            //var sortOperation = new BsonDocument { { "$sort", new BsonDocument { { "CreateDate", 1 } } } };
            ////var ProjectFinal = new BsonDocument { { "$project", new BsonDocument { { "_id", 0 }, { "UserId", "EmailAddress" }, { "ValueFeedStories", "$ValueFeedStories" } } } };
            //IEnumerable<BsonDocument> pipeline = new[] { matchMember, unwindStories, sortOperation };

            //var args = new AggregateArgs();
            //args.Pipeline = pipeline;
            //args.AllowDiskUse = true;

            //return _userCollection.Aggregate(args).ToJson();
            //_userCollection = con.GetCollection("UserDetails");
            MongoCursor<User> result = _userCollection.FindAs<User>(Query.EQ("ValueFeedStories.ImpactZone", ImpactZone));
            List<ValueFeedStory> stories = new List<ValueFeedStory>();
            foreach (var item in result)
            {
                var story = item.ValueFeedStories.Where(x => x.ImpactZone == ImpactZone).ToArray();
                stories.AddRange(story);
            }
            return stories;

        }

        public string GetVCSCActivity(string EmailAddress)
        {
            var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));

            return userDetail.ValueCreationActivity.ToJson();
        }
        public bool uploadResourceFile(string EmailAddress, object[] fileName)
        {

            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));


                List<FileUpload> path = new List<FileUpload>();


                foreach (var r in fileName)
                {
                    FileUpload obj = new FileUpload();
                    obj.Id = ObjectId.GenerateNewId();
                    obj.FileName = string.Format("ArtiFacts/{0}", r);
                    path.Add(obj);
                }
                //Dictionary<User, string> list = new Dictionary<User, string>();
                //if (list.ContainsKey(userDetail))
                //{
                if (userDetail.Files == null)
                    userDetail.Files = new List<FileUpload>();

                userDetail.Files.AddRange(path.ToList());

                _userCollection.Save(userDetail);
                // }

                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserPhoto().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at uploadResourceFile()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
            //_conversationsCollections = con.GetCollection("Conversations");
            //List<Conversation> typeCoaching = _conversationsCollections.AsQueryable<Conversation>().Where<Conversation>(sb => sb.ConversationType == "Coaching" && sb.Content.StartsWith("COACHING REQUEST BY")).ToList();

        }

        public bool uploadResourceFile(string EmailAddress, object[] filePath, string tagName, Dictionary<int, string> filename)
        {

            bool _transactionStatus = false;
            try
            {
                var userDetail = _userCollection.FindOneAs<User>(Query.EQ("EmailAddress", EmailAddress));


                List<FileUpload> path = new List<FileUpload>();



                foreach (var f in filename)
                {
                    if (filename.ContainsKey(f.Key))
                    {

                        FileUpload obj = new FileUpload();
                        obj.Id = ObjectId.GenerateNewId();
                        obj.FilePath = string.Format("FilePath/{0}", f.Value);

                        obj.FileName = f.Value;
                        obj.TagName = tagName;
                        path.Add(obj);

                    }

                }

                if (userDetail.Files == null)
                    userDetail.Files = new List<FileUpload>();

                userDetail.Files.AddRange(path.ToList());

                _userCollection.Save(userDetail);


                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at UpdateUserPhoto().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new Exception("User does not Exist!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at uploadResourceFile()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true);
                var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
            //_conversationsCollections = con.GetCollection("Conversations");
            //List<Conversation> typeCoaching = _conversationsCollections.AsQueryable<Conversation>().Where<Conversation>(sb => sb.ConversationType == "Coaching" && sb.Content.StartsWith("COACHING REQUEST BY")).ToList();

        }

        public bool DeleteResourceFiles(List<FileUpload> list)
        {
            bool _transactionStatus = false;
            try
            {
                foreach (var r in list)
                {
                    var query = Query.And(Query.EQ("_id", r.Id));
                    _userCollection.Remove(query);

                }
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at DeleteCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at DeleteCoacheeOrMentee()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true); var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }
        public bool DeleteBookMarks(List<BookMark> list)
        {
            bool _transactionStatus = false;
            try
            {
                foreach (var r in list)
                {
                    var query = Query.And(Query.EQ("_id", r.Id));
                    _userCollection.Remove(query);

                }
                _transactionStatus = true;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at DeleteCoacheeOrMentee().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("Signup failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at DeleteCoacheeOrMentee()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true); var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("Signup failure!!!");
            }
            finally
            {

            }
            return _transactionStatus;
        }

        public string GetFullName(string EmailAddress)
        {            
            try
            {
                var result = _userCollection.FindOneAs<IUser>(Query.EQ("EmailAddress", EmailAddress));
                return result.FirstName + " " + result.LastName;
            }
            catch (MongoException ex)
            {
                string message = "{ Error : 'Failed at GetFullName().', Log: " + ex.Message + ", Trace: " + ex.StackTrace + "} ";
                _logCollection.Insert(message);
                throw new MongoException("GetFullName() failure!!!");
            }
            catch (Exception e)
            {
                Exceptionhandle em = new Exceptionhandle();
                em.Error = "Failed at GetFullName()";
                em.Log = e.Message.Replace("\r\n", "");
                var st = new System.Diagnostics.StackTrace(e, true); var frame = st.GetFrame(0);
                var line = frame.GetFileLineNumber();
                _logCollection.Insert(em);
                throw new MongoException("GetFullName() failure!!!");
            }
        }
    }
}
