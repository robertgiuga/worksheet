﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace worksheet.Utils
{
    public interface IPasswordHasher
    {
        string Hash(string password);

        (bool Verified, bool NeedsUpgrade) Check(string hash, string password);
    }
}
