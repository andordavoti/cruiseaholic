using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cruisaholic.DAL;
using Cruisaholic.Models;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.AspNetCore.Http;

namespace Cruisaholic.Controllers
{
    [Route("[controller]/[action]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderDB;

        private ILogger<OrderController> _orderLog;

        private const string _isLoggedIn = "_isLoggedIn";

        public OrderController(IOrderRepository orderDB, ILogger<OrderController> orderLog)
        {
            _orderDB = orderDB;
            _orderLog = orderLog;
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
                catch (Exception err)
                {
                    _orderLog.LogInformation("Something went wrong saving the order! Err: " + err);
                    return BadRequest("Something went wrong saving the order!" + err);
                }
            }
            _orderLog.LogInformation("Model not valid in NewOrder! Number of errors: " + ModelState.ErrorCount);
            return BadRequest("Model not valid in NewOrder! Number of errors: " + ModelState.ErrorCount);
        }

        public async Task<ActionResult> GetCustomerInfo(string email)
        {
            var customerInfo = await _orderDB.GetCustomerInfo(email);

            if (customerInfo == null)
            {
                _orderLog.LogInformation("Customer with email: " + email + ", was not found");
                return NotFound("Customer with email: " + email + ", was not found");
            }

            return Ok(customerInfo);
        }

        public async Task<ActionResult> GetRoutes()
        {
            var routes = await _orderDB.GetRoutes();

            if (routes == null)
            {
                _orderLog.LogInformation("Routes not set up correcly in DB");
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
                    _orderLog.LogInformation("Unable to add new route");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Unable to add new route");
                }

                return Ok(routes);
            }

            _orderLog.LogInformation("Model not valid in AddRoute! Number of errors: " + ModelState.ErrorCount);
            return BadRequest("Model not valid in AddRoute! Number of errors: " + ModelState.ErrorCount);
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
                    _orderLog.LogInformation("Unable to change route");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Unable to change route");
                }

                return Ok(routes);
            }

            _orderLog.LogInformation("Model not valid in ChangeRoute! Number of errors: " + ModelState.ErrorCount);
            return BadRequest("Model not valid in ChangeRoute! Number of errors: " + ModelState.ErrorCount);
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
                _orderLog.LogInformation("Unable to remove route");
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
                    _orderLog.LogInformation("Login failed for username: " + user.Username);
                    HttpContext.Session.SetString(_isLoggedIn, "");
                    return Ok(false);
                }
                HttpContext.Session.SetString(_isLoggedIn, "YES");
                return Ok(true);
            }
            _orderLog.LogInformation("Model not valid in LoggInn! Number of errors: " + ModelState.ErrorCount);
            return BadRequest("Model not valid in LoggInn! Number of errors: " + ModelState.ErrorCount);
        }

        public void LogOut()
        {
            HttpContext.Session.SetString(_isLoggedIn, "");
        }
    }
}
