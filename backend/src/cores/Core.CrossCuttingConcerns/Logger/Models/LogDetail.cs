﻿
namespace Core.CrossCuttingConcerns.Logger.Models;

public class LogDetail
{
    public string FullName { get; set; }
    public string MethodName { get; set; }
    public string User { get; set; }
    public List<LogParamater> Parameters { get; set; }
}
