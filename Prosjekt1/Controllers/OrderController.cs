using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cruisaholic.DAL;
using Cruisaholic.Models;
using Microsoft.Extensions.Logging;
using System;

namespace Cruisaholic.Controllers
{
    [Route("[controller]/[action]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderDB;

        private ILogger<OrderController> _orderLog;

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

    }

}
