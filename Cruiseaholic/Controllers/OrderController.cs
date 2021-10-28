using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cruiseaholic.DAL;
using Cruiseaholic.Models;
using System;
using Microsoft.AspNetCore.Http;
using NLog;

namespace Cruiseaholic.Controllers
{
    [Route("[controller]/[action]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderDB;

        private static readonly Logger _logger = LogManager.GetLogger("cruiseaholic-logs");

        private const string _isLoggedIn = "_isLoggedIn";

        public OrderController(IOrderRepository orderDB)
        {
            _orderDB = orderDB;
        }

        [HttpPost]
        public async Task<ActionResult> NewOrder([FromBody] CustomerOrder newOrder)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var customerEmail = await _orderDB.NewOrder(newOrder);
                    return Ok(customerEmail);
                }
                catch (Exception e)
                {
                    _logger.Error(e.Message);
                    return BadRequest("Something went wrong saving the order!");
                }
            }
            _logger.Error("Model not valid in NewOrder!");
            return BadRequest("Model not valid in NewOrder!");
        }

        public async Task<ActionResult> GetCustomerInfo(string email)
        {
            var customerInfo = await _orderDB.GetCustomerInfo(email);

            if (customerInfo == null)
            {
                _logger.Error("Customer with email: " + email + ", was not found");
                return NotFound("Customer with email: " + email + ", was not found");
            }

            return Ok(customerInfo);
        }

        public async Task<ActionResult> GetRoutes()
        {
            var routes = await _orderDB.GetRoutes();

            if (routes == null)
            {
                _logger.Error("Routes not set up correcly in DB!");
                return NotFound("Routes not set up correcly in DB");
            }

            return Ok(routes);
        }

        [HttpPost]
        public async Task<ActionResult> AddRoute([FromBody] Route route)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_isLoggedIn)))
            {
                return Unauthorized();
            }

            if (ModelState.IsValid)
            {
                var routes = await _orderDB.AddRoute(route);

                if (routes == null)
                {
                    _logger.Error("Unable to add new route!");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Unable to add new route");
                }

                return Ok(routes);
            }

            _logger.Error("Model not valid in AddRoute!");
            return BadRequest("Model not valid in AddRoute!");
        }

        [HttpPost]
        public async Task<ActionResult> ChangeRoute([FromBody] Route route)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_isLoggedIn)))
            {
                return Unauthorized();
            }

            if (ModelState.IsValid)
            {
                var routes = await _orderDB.ChangeRoute(route);

                if (routes == null)
                {
                    _logger.Error("Unable to change route!");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Unable to change route");
                }

                return Ok(routes);
            }

            _logger.Error("Model not valid in ChangeRoute!");
            return BadRequest("Model not valid in ChangeRoute!");
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveRoute(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_isLoggedIn)))
            {
                return Unauthorized();
            }

            var routes = await _orderDB.RemoveRoute(id);

            if (routes == null)
            {
                _logger.Error("Unable to remove route!");
                return StatusCode(StatusCodes.Status500InternalServerError, "Unable to remove route");
            }

            return Ok(routes);
        }

        public ActionResult AuthorizeUser()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(_isLoggedIn)))
            {
                return Unauthorized();
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost]
        public async Task<ActionResult> Login([FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                bool ok = await _orderDB.Login(user);
                if (!ok)
                {
                    _logger.Error("Login failed for username: " + user.Username);
                    HttpContext.Session.SetString(_isLoggedIn, "");
                    return Ok(false);
                }
                HttpContext.Session.SetString(_isLoggedIn, "YES");
                return Ok(true);
            }
            _logger.Error("Model not valid in LoggInn!");
            return BadRequest("Model not valid in LoggInn!");
        }

        public ActionResult LogOut()
        {
            HttpContext.Session.SetString(_isLoggedIn, "");
            return Ok();
        }
    }
}
